
import Graph from "../../../../components/graph";
import { getRate } from "@/app/lib/currency/actions";
import { getMonthNumber} from "@/app/lib/formatterService";
import { TransactionsTable } from "@/app/components/table";
import { redirect } from "next/navigation";
import {fetchAllTransactionsOfMonth, fetchAllTransactionsOfMonthGroupByDate} from "@/app/lib/transaction/data";
import {GroupedTransactions, Transaction} from "@/app/lib/definitions";

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
    const transactions : Transaction[]= data[1]
    if (transactions.length === 0) return redirect(`/years/${year}`)
    const rate: number = data[2]
    return (
        <div className={`flex flex-col gap-4 w-full`}>
            <div className={`w-full h-full grid grid-cols-2 gap-10 flex-1`}>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={groupedTransactions.map(t => t.date.getDate().toString())}
                           dataset={groupedTransactions.map(t => t.sum)}
                           currency={'EUR'}
                           title={`Analysis in ${month.toUpperCase()}, ${year}`}/>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={groupedTransactions.map(t => t.date.getDate().toString())}
                           dataset={groupedTransactions.map(t => t.sum * rate)}
                           currency={'VND'}
                           title={`Analysis in ${month.toUpperCase()}, ${year}`}/>
                </div>
            </div>
            <TransactionsTable transactions={transactions} month={month} year={year} rate={rate}/>
        </div>
    )
}