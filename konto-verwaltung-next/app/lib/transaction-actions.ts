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

const reverseMonths: {
    [key: number]: string
} = {
    1: 'january',
    2: 'february',
    3: 'march',
    4: 'april',
    5: 'may',
    6: 'june',
    7: 'july',
    8: 'august',
    9: 'september',
    10: 'october',
    11: 'november',
    12: 'december'
}

const CreateTransactionSchema = TransactionSchema.omit({ id: true })
const UpdateTransactionSchema = TransactionSchema.omit({ id: true })

export async function updateTransaction(id: number, formData: FormData) {
    const validatedFields = UpdateTransactionSchema.safeParse({
        value: formData.get("value"),
        date: formData.get("date"),
        description: formData.get("description"),
        type: formData.get("type")
    })
    if (validatedFields.success) {
        let { value, date, description, type } = validatedFields.data
        if (!date) date = new Date().toISOString().split('T')[0]
        value = type === "income" ? value : -value
        const response = await fetch(`${BASE_URL}/transactions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                value, date, description, type
            })
        })
        const json = await response.json()
        date = json.date.split('-')
        const path = `/years/${date[0]}/months/${reverseMonths[parseInt(date[1])]}`
        revalidatePath(path)
        redirect(path)
    }
}

export async function deleteTransaction(id: number, month: string, year: string) {
    await fetch(`${BASE_URL}/transactions/${id}`, { method: "DELETE" })
    const path = `/years/${year}/months/${months[month]}`
    revalidatePath(path)
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
        description: formData.get("description"),
        type: formData.get("type")
    })
    if (!validatedFields.success) {
        return {
            status: 400,
            message: z.treeifyError(validatedFields.error)
        }
    }
    let { value, date, description, type } = validatedFields.data
    if (!date) date = new Date().toISOString().split('T')[0]
    value = type === "income" ? value : -value
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            value, date, description, type
        })
    })
    return {
        status: response.status,
        message: response.statusText
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