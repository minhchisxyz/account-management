import { redirect } from "next/navigation";
import {fetchAllTransactionsOfMonth, fetchAllTransactionsOfMonthGroupByDate} from "@/app/lib/transaction/data";
import {getRate} from "@/app/lib/currency/data";
import {GroupedTransactions, Transaction} from "@/app/lib/definitions";
import {getMonthNumber} from "@/app/lib/formatterService";
import Graph from "@/app/ui/graph";
import {TransactionsTable} from "@/app/ui/table";

export default async function MonthDetailsPage({
    params
}: {
    params: Promise<{month: string, year: number}>
}) {
  const {month, year} = await params
  const data = await Promise.all([
    fetchAllTransactionsOfMonthGroupByDate(year, getMonthNumber(month)),
    fetchAllTransactionsOfMonth(year, getMonthNumber(month)),
    getRate()
  ])
  const groupedTransactions: GroupedTransactions[] = data[0]
  const groupedLabels = groupedTransactions.map(t => t.date.getDate().toString())
  const rate: number = data[2]
  const groupedDataset = {
    euro: groupedTransactions.map(t => t.total),
    vnd: groupedTransactions.map(t => t.total * rate)
  }
  const transactions : Transaction[]= data[1]
  if (transactions.length === 0) return redirect(`/account-management/years/${year}`)
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden gap-4 pb-6">
          <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* graphs block takes some space at top (auto height) */}
            <div className="flex-none w-full">
              <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-2 md:gap-10">
                <div className="flex w-full flex-col items-center justify-center">
                  <Graph
                      labels={groupedLabels}
                      dataset={groupedDataset.euro}
                      currency={"EUR"}
                      title={`Analysis in ${month.toUpperCase()}, ${year}`}
                  />
                </div>
                <div className="flex w-full flex-col items-center justify-center">
                  <Graph
                      labels={groupedLabels}
                      dataset={groupedDataset.vnd}
                      currency={"VND"}
                      title={`Analysis in ${month.toUpperCase()}, ${year}`}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <TransactionsTable
                  transactions={transactions}
                  month={month}
                  year={year}
                  rate={rate}
              />
            </div>
          </div>
        </div>
    )
}