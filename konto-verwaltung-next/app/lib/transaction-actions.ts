'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"

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
    description: z.string().min(1, { message: "Description is required" })
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

export async function deleteTransaction(id: number, month: string, year: string) {
    console.log(id)
    await fetch(`${BASE_URL}/transactions/${id}`, { method: "DELETE" })
    revalidatePath(`/years/${year}/months/${month}`)
    redirect(`/years/${year}/months/${month}`)
}

export async function getAllTransactionsInMonth(month: string, year: string) {
    const response = await fetch(`${BASE_URL}/years/${year}/months/${months[month]}`)
    return response.json()
}

export async function getAllMonthTotals(year: string) {
    const response = await fetch(`${BASE_URL}/years/${year}/month-total`)
    return response.json()
}

export async function createTransaction(formData: FormData) {
    const validatedFields = CreateTransactionSchema.safeParse({
        value: formData.get("value"),
        date: formData.get("date"),
        description: formData.get("description")
    })
    if (validatedFields.success) {
        if (!validatedFields.data.date) validatedFields.data.date = new Date().toISOString().split('T')[0]
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validatedFields.data)
        })
    }
}

export async function getAllTransactionsInYear(year: string) {
    const response = await fetch(`${BASE_URL}/years/${year}`)
    return response.json()
}

export async function getAllYears() {
    const response = await fetch(`${BASE_URL}/years`)
    return response.json()
}

export async function getAllYearTotals() {
    const response = await fetch(`${BASE_URL}`)
    return response.json()
}

export async function getAllMonths(year: string) {
    const response = await fetch(`${BASE_URL}/years/${year}/months`)
    return response.json()
}

export async function getBalance() {
    const response: YearTotal[] = await (await fetch(`${BASE_URL}`)).json()
    return response.map(y => y.total).reduce((a, b) => a + b, 0)
}