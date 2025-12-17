import {GoogleGenAI} from "@google/genai";
import {NextRequest, NextResponse} from "next/server";

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite'
]
const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY
})

type Response = {
  date: string,
  description: string,
  amount: number
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function generateWithRetry(prompt: string, modelName: string, retries = 2) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      config: {
        responseMimeType: 'application/json'
      },
      contents: `Today: ${new Date().toISOString()}. Extract the transaction {
      date: string in yyyy-MM-dd format (default: today),
      description: string (description should be in the language of the text below, default: ''),
      amount: number (also not that spending is negative and income positive, default: 0)
      }
      (just return one transaction) from this text: ${prompt}`,
    })
    const jsonResponse: Response = JSON.parse(response.text || '{}')
    return jsonResponse
  } catch (error: any) {
    if (error?.status === 503 && retries > 0) {
      console.warn(`Model ${modelName} overloaded. Retrying... (${retries} attempts left)`);
      await delay(1000);
      return generateWithRetry(prompt, modelName, retries - 1);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  if (!GEMINI_API_KEY) return NextResponse.json(
      { error: 'No API Key provided', code: "INVALID_CONFIG" },
      { status: 500 }
  )
  const { prompt } = await request.json()

  let lastError;

  for (const modelName of MODELS) {
    try {
      const response = await generateWithRetry(prompt, modelName);
      console.log(`Response from ${modelName}:`, response);
      return NextResponse.json(response);
    } catch (error: any) {
      console.warn(`Model ${modelName} failed after retries.`, error);
      lastError = error;
      // Continue to the next model
    }
  }

  console.error("All models failed:", lastError);
  return NextResponse.json(
      { error: 'Service currently unavailable. Please try again later.', code: "SERVICE_OVERLOADED" },
      { status: 503 }
  );
}
