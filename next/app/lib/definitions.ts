import z from "zod";

export type YearlyTotal = {
  year: number,
  totalEUR: number,
  totalVND: number
}

export type MonthlyTotal = {
  month: number,
  totalEUR: number,
  totalVND: number
}

export type MonthlyTotalWithMonthName = {
  month: string,
  totalEUR: number,
  totalVND: number
}

export type Transaction = {
  id: number,
  date: Date,
  description: string,
  amountEUR: number,
  amountVND: number
}

export type GroupedTransactions = {
  date: Date,
  totalEUR: number,
  totalVND: number
}

export type CurrencyRate = {
  date: Date,
  rate: number
}

const TransactionSchema = z.object({
  id: z.string(),
  amount: z.coerce
      .number(),
  date: z.string(),
  description: z.string().min(1, { message: "Description is required" }),
  type: z.enum(["income", "expense"]).optional()
});

export type SessionPayload = {
  username: string,
  expiresAt: Date
}
export const SignInSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" })
})
export const CreateTransactionSchema = TransactionSchema.omit({ id: true })
export const UpdateTransactionSchema = TransactionSchema.omit({ id: true })

export type SignInState = {
  error: string
} | undefined

export type CreateTransactionState = {
  error: string
} | undefined
