import {NextRequest, NextResponse} from "next/server";
import {deleteTransaction, editTransaction, getTransaction, saveTransaction} from "@/app/lib/transaction/data";
import {CreateTransactionSchema} from "@/app/lib/definitions";
import z from "zod";

export async function GET(request: NextRequest, {params}: { params: Promise<{ transactionId: string }>}) {
  const {transactionId} = await params
  return NextResponse.json(await getTransaction(Number(transactionId)))
}

export async function PUT(request: NextRequest, {params}: { params: Promise<{ transactionId: string }>}) {
  const {transactionId} = await params
  const body = await request.json();
  const validatedFields = CreateTransactionSchema.safeParse({
    amount: body.amount,
    date: body.date,
    description: body.description
  })
  if (validatedFields.success) {
    const { amount, date, description } = validatedFields.data
    return NextResponse.json(
        await editTransaction(
            Number(transactionId),
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

export async function DELETE(request: NextRequest, {params}: { params: Promise<{ transactionId: string }>}) {
  const {transactionId} = await params
  await deleteTransaction(Number(transactionId))
  return NextResponse.json({id: transactionId})
}