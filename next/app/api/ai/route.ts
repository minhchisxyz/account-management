
import {NextRequest, NextResponse} from "next/server";
import {generateResponse} from "@/app/lib/gemini";

export async function POST(request: NextRequest) {

  const { prompt } = await request.json()

  const res = await generateResponse(prompt)

  if (res) return NextResponse.json(res)

  return NextResponse.json(
    { error: 'Service currently unavailable. Please try again later.', code: "SERVICE_OVERLOADED" },
    { status: 503 }
  )
}

