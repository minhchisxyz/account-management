import {saveTransaction} from "@/app/lib/transaction/data";
import z from "zod";
import {NextResponse} from "next/server";
import {CreateTransactionSchema} from "@/app/lib/definitions";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = CreateTransactionSchema.safeParse({
    amount: body.amount,
    date: body.date,
    description: body.description
  })
  if (validatedFields.success) {
    const { amount, date, description } = validatedFields.data
    return NextResponse.json(
        await saveTransaction(
            amount,
            description,
            date ? new Date(date) : new Date()
        )
    )
  }
  return NextResponse.json(
      { error: z.treeifyError(validatedFields.error), code: "INVALID_INPUT" },
      { status: 400 }
  )
}