'use server'

import {addTransaction} from "@/app/lib/transaction/helper";
import { UpdateTransactionSchema} from "@/app/lib/definitions";
import {revalidatePath} from "next/cache";
import {deleteTransaction, editTransaction} from "@/app/lib/transaction/data";
import {getMonthName} from "@/app/lib/formatterService";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/prisma";

export async function createTransaction(formData: FormData) {
  const type = formData.get('type') as string
  if (type !== 'income' && type !== 'expense') return false
  const amount = parseFloat(formData.get('amount') as string ?? 0)
  const res = await addTransaction({
    amount: type === 'income' ? amount : -amount,
    description: formData.get('description') as string ?? '',
    date: formData.get('date') as string ?? new Date().toISOString()
  })
  return res !== null
}

export async function updateTransaction(id: number, formData: FormData) {
  const validatedFields = UpdateTransactionSchema.safeParse({
    amount: formData.get("amount"),
    date: formData.get("date"),
    description: formData.get("description"),
    type: formData.get("type")
  })
  if (validatedFields.success) {
    const { amount, date, description, type } = validatedFields.data
    const updatedDate = date ? new Date(date) : new Date()
    await editTransaction(
        id,
        type === "income" ? amount : -amount,
        description,
        updatedDate
    )
    const path = `/years/${updatedDate.getFullYear()}/months/${getMonthName(updatedDate.getMonth() + 1)}`
    revalidatePath(path)
    return path
  }
}

export async function removeTransaction(id: number | string) {
  const transaction = await prisma.transaction.findUnique({where: {id: Number(id)}})
  if (!transaction) {
    console.error(`Transaction ${id} not found`)
    return
  }
  const date = new Date(transaction.date)
  await deleteTransaction(Number(id))
  const path = `/years/${date.getFullYear()}/months/${getMonthName(date.getMonth() + 1)}`
  revalidatePath(path)
  redirect(path)
}