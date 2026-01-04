import {saveTransaction} from "@/app/lib/transaction/data";
import z from "zod";
import {NextResponse} from "next/server";
import {CreateTransactionSchema} from "@/app/lib/definitions";
import {getRate} from "@/app/lib/currency/data";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = CreateTransactionSchema.safeParse({
    amount: body.amount,
    date: body.date,
    description: body.description
  })
  if (validatedFields.success) {
    const { amount, date, description } = validatedFields.data
    const inputDate = new Date(date)
    const today = new Date()
    inputDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    if (inputDate > today) {
      return NextResponse.json(
          { error: 'Date not valid (cannot be in the future)', code: "INVALID_INPUT" },
          { status: 400 }
      )
    }
    const rate = await getRate(date)
    return NextResponse.json(
        await saveTransaction(
            amount,
            amount * rate,
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