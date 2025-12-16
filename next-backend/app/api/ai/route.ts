import {GoogleGenAI} from "@google/genai";
import {NextRequest, NextResponse} from "next/server";

const MODEL = 'gemini-2.5-flash-lite'
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

async function generateWithRetry(prompt: string, modelName: string, retries = 3) {
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      config: {
        responseMimeType: 'application/json'
      },
      contents: `Today: ${new Date().toISOString()}. Extract the transaction {
      date: string in yyyy-MM-dd format,
      description: string, 
      amount: number (also not that spending is negative and income positive)
      }
       from this text: ${prompt}`,
    })
    const jsonResponse: Response = JSON.parse(response.text || '{}')
    console.log(jsonResponse)
    return jsonResponse
  } catch (error: any) {
    // If it's a 503 (Overloaded) and we have retries left, wait and try again
    if (error?.status === 503 && retries > 0) {
      console.warn(`Model ${modelName} overloaded. Retrying... (${retries} attempts left)`);
      await delay(1000); // Wait 1 second before retrying
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
  try {
    // 1. Try the primary model (Gemini 2.5) with retries
    let response;
    try {
      response = await generateWithRetry(prompt, MODEL);
    } catch (primaryError: any) {
      // 2. If Primary fails after retries, try Fallback (Gemini 1.5)
      return NextResponse.json(
          { error: 'Service currently unavailable. Please try again later.', code: "SERVICE_OVERLOADED" },
          { status: 503 }
      );
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error("All models failed:", error);
    return NextResponse.json(
        { error: 'Service currently unavailable. Please try again later.', code: "SERVICE_OVERLOADED" },
        { status: 503 }
    );
  }
}