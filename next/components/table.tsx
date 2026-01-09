'use client'

import { EuroIcon, VietnamIcon } from "./icons";
import Link from "next/link";
import {formatDate, formatEuro, formatVND} from "@/app/lib/formatterService";
import {removeTransaction} from "@/app/lib/transaction/actions";
import { MonthlyTotalWithMonthName, Transaction} from "@/app/lib/definitions";
import {SquarePen, Trash} from "lucide-react";

export function TransactionsTable({
    transactions
}: {
    transactions: Transaction[]
}) {
  const mappedTransactions = transactions.map(t => ({
    ...t,
    euro: formatEuro(t.amountEUR),
    vnd: formatVND(t.amountVND),
    date: formatDate(t.date),
    isoDate: t.date.toISOString().split('T')[0]
  }))
  return (
      <div className="h-full w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="inline-flex items-center justify-center gap-1">
                <EuroIcon />
              </span>
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="inline-flex items-center justify-center gap-1">
                <VietnamIcon />
              </span>
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Edit
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Delete
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
          {mappedTransactions.map((t) => (
              <tr key={t.id} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 text-center text-slate-700">
                  {t.date}
                </td>
                <td className="px-4 py-3 text-left text-slate-700">
                  {t.description}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {t.euro}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {t.vnd}
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center justify-center">
                    <Link
                        href={`/transactions?id=${t.id}&amount=${t.amountEUR}&description=${t.description}&date=${t.isoDate}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <SquarePen className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
                <td className="px-2 py-3">
                  <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => removeTransaction(t.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  )
}

export function MonthsTable({
    totals
}: {
  totals: MonthlyTotalWithMonthName[],
}) {
  return (
      <div
          className="h-full w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm"
      >
        <table className="min-w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              Month
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="inline-flex items-center justify-center gap-1">
                      <EuroIcon />
                    </span>
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <span className="inline-flex items-center justify-center gap-1">
                      <VietnamIcon />
                    </span>
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
          {totals.map((t) => (
              <tr key={t.month} className="transition-colors hover:bg-slate-50">
                <td className="px-4 py-3 text-center text-slate-700">
                  {t.month}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatEuro(t.totalEUR)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  {formatVND(t.totalVND)}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  )
}