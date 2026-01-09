import {CreateTransactionSchema} from "@/app/lib/definitions";
import {getRate} from "@/app/lib/currency/data";
import {saveTransaction} from "@/app/lib/transaction/data";

export async function addTransaction({amount, description, date}: {
  amount: number,
  description: string,
  date: string
}) {
  const validatedFields = CreateTransactionSchema.safeParse({
    amount,
    date,
    description
  })
  if (validatedFields.success) {
    const { amount, date, description } = validatedFields.data
    const inputDate = new Date(date)
    const today = new Date()
    inputDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    if (inputDate > today) {
      return null
    }
    const rate = await getRate(date)
    return await saveTransaction(
          amount,
          amount * rate,
          description,
          date ? new Date(date) : new Date()
      )

  }
  return null
}