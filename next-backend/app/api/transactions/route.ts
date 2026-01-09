
import {NextResponse} from "next/server";
import {addTransaction} from "@/app/lib/transaction/helper";

export async function POST(request: Request) {
  const body = await request.json()
  const res = await addTransaction({
    amount: body.amount,
    date: body.date,
    description: body.description
  })
  return res ? NextResponse.json(res) : NextResponse.json(
      { error: 'Error creating transaction', code: "INVALID_INPUT" },
      { status: 400 }
  )
}