import {saveTransaction} from "@/app/lib/transaction/data";
import z from "zod";
import {NextResponse} from "next/server";

const TransactionSchema = z.object({
  id: z.string(),
  value: z.coerce
      .number(),
  date: z.string(),
  description: z.string().min(1, { message: "Description is required" })
});

const CreateTransactionSchema = TransactionSchema.omit({ id: true })
const UpdateTransactionSchema = TransactionSchema.omit({ id: true })

export async function POST(request: Request) {
  const body = await request.json();
  const validatedFields = CreateTransactionSchema.safeParse({
    value: body.get("value"),
    date: body.get("date"),
    description: body.get("description")
  })
  if (validatedFields.success) {
    const { value, date, description } = validatedFields.data
    return NextResponse.json(
        await saveTransaction(
            value,
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