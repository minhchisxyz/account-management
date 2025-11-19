'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"
import {editTransaction, removeTransaction, saveTransaction} from "@/app/lib/transaction/data";
import {getMonthName} from "@/app/lib/formatterService";

const BASE_URL = `${process.env.BASE_URL as string}/transactions`

export type YearTotal = {
    year: number,
    total: number
}

export type MonthTotal = {
    month: string,
    total: number
}

export type Transaction = {
    id: number,
    date: string,
    description: string,
    value: number
}

const TransactionSchema = z.object({
    id: z.string(),
    value: z.coerce
        .number(),
    date: z.string(),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.string()
});

const months: {
    [key: string]: number
} = {
    'january': 1,
    'february': 2,
    'march': 3,
    'april': 4,
    'may': 5,
    'june': 6,
    'july': 7,
    'august': 8,
    'september': 9,
    'october': 10,
    'november': 11,
    'december': 12
}

const CreateTransactionSchema = TransactionSchema.omit({ id: true })
const UpdateTransactionSchema = TransactionSchema.omit({ id: true })

export async function createTransaction(formData: FormData) {
  const validatedFields = CreateTransactionSchema.safeParse({
    value: formData.get("value"),
    date: formData.get("date"),
    description: formData.get("description"),
    type: formData.get("type")
  })
  if (validatedFields.success) {
    const { value, date, description, type } = validatedFields.data
    await saveTransaction(
        type === "income" ? value : -value,
        description,
        date ? new Date(date) : new Date())
  }
}


export async function updateTransaction(id: number, formData: FormData) {
  const validatedFields = UpdateTransactionSchema.safeParse({
      value: formData.get("value"),
      date: formData.get("date"),
      description: formData.get("description"),
      type: formData.get("type")
  })
  if (validatedFields.success) {
    const { value, date, description, type } = validatedFields.data
    const updatedDate = date ? new Date(date) : new Date()
    await editTransaction(
        id,
        type === "income" ? value : -value,
        description,
        updatedDate)
    const path = `/years/${updatedDate.getFullYear()}/months/${getMonthName(updatedDate.getMonth() + 1)}`
    revalidatePath(path)
    redirect(path)
  }
}

export async function deleteTransaction(id: number, month: string, year: number) {
    await removeTransaction(id)
    const path = `/years/${year}/months/${months[month]}`
    revalidatePath(path)
    redirect(`/years/${year}/months/${month}`)
}