import z from "zod";

export type YearTotal = {
  year: number,
  totalEUR: number,
  totalVND: number
}

export type MonthTotal = {
  month: number,
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
  description: z.string().min(1, { message: "Description is required" })
});

export const CreateTransactionSchema = TransactionSchema.omit({ id: true })
export const UpdateTransactionSchema = TransactionSchema.omit({ id: true })
