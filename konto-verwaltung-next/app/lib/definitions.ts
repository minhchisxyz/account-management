export type YearTotal = {
  year: number,
  total: number
}

export type MonthTotal = {
  month: number,
  total: number
}

export type Transaction = {
  id: number,
  date: Date,
  description: string,
  value: number
}

export type GroupedTransactions = {
  date: Date,
  sum: number
}

export type CurrencyRate = {
  date: Date,
  rate: number
}
