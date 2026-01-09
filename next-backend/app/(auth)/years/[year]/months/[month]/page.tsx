import { redirect } from "next/navigation";
import {fetchAllTransactionsOfMonth, fetchAllTransactionsOfMonthGroupByDate} from "@/app/lib/transaction/data";
import {GroupedTransactions, Transaction} from "@/app/lib/definitions";
import {getMonthNumber} from "@/app/lib/formatterService";
import Graph from "@/components/graph";
import {TransactionsTable} from "@/components/table";

export default async function MonthDetailsPage({
  params
}: {
  params: Promise<{month: string, year: number}>
}) {
  const {month, year} = await params
  const [groupedTransactions, transactions]: [GroupedTransactions[], Transaction[]] = await Promise.all([
    fetchAllTransactionsOfMonthGroupByDate(year, getMonthNumber(month)),
    fetchAllTransactionsOfMonth(year, getMonthNumber(month)),
  ])
  const groupedLabels = groupedTransactions.map(t => t.date.getDate().toString())
  const groupedDataset = {
    eur: groupedTransactions.map(t => t.totalEUR),
    vnd: groupedTransactions.map(t => t.totalVND)
  }

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
                dataset={groupedDataset.eur}
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
          />
        </div>
      </div>
    </div>
  )
}

