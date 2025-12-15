'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"
import {editTransaction, removeTransaction, saveTransaction} from "./data";
import {getMonthName} from "../formatterService";

const TransactionSchema = z.object({
    id: z.string(),
    value: z.coerce
        .number(),
    date: z.string(),
    description: z.string().min(1, { message: "Description is required" }),
    type: z.string()
});

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
    const path = `/account-management/years/${updatedDate.getFullYear()}/months/${getMonthName(updatedDate.getMonth() + 1)}`
    revalidatePath(path)
    redirect(path)
  }
}

export async function deleteTransaction(id: number, month: string, year: number) {
    await removeTransaction(id)
    const path = `/account-management/years/${year}/months/${month}`
    revalidatePath(path)
    redirect(path)
}