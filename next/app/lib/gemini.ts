'use server'
import {GoogleGenAI} from "@google/genai";

const MODELS = [
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite'
]
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not set')

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
})

type Response = {
  date: string,
  description: string,
  amount: number,
  text: string
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function generateWithRetry(prompt: string, modelName: string, fileType: string | undefined, retries = 2) {
  try {
    const contents = {
      text: `Today: ${new Date().toISOString()}. Extract the transaction {
                date: string in yyyy-MM-dd format (default: today),
                description: string (description should be in the language of the text below, default: ''),
                amount: number (also not that spending is negative and income positive, default: 0),
                text: string (transcribe the audio exactly as heard)
                }
                (just return one transaction) from ${!fileType ? `this text: ${prompt}` : 'this audio. The speaker may use language that is not English (Priorities: Vietnamese, English, German). Please provide the transcription in the original languages spoken, maintaining the code-switching exactly as it occurs.'}`,
      ...(fileType && {
        mimeType: fileType,
        data: prompt
      })
    }
    const response = await ai.models.generateContent({
      model: modelName,
      config: {
        responseMimeType: 'application/json'
      },
      contents: contents
    })
    const jsonResponse: Response = JSON.parse(response.text || '{}')
    return jsonResponse
  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Model ${modelName} failed. Retrying... (${retries} attempts left)`)
      await delay(1000)
      return generateWithRetry(prompt, modelName, fileType, retries - 1)
    }
    throw error;
  }
}

export async function generateResponse(input: string | Blob) {
  const prompt = input instanceof Blob ? Buffer.from(await input.arrayBuffer()).toString('base64') : input
  let lastError
  for (const modelName of MODELS) {
    try {
      const response = await generateWithRetry(prompt, modelName, input instanceof Blob ? (input as File).type : undefined)
      console.log(`Response from ${modelName}:`, response)
      return response
    } catch (error: any) {
      console.warn(`Model ${modelName} failed after retries.`, error)
      lastError = error
    }
  }
  console.error("All models failed:", lastError)
  return null
}