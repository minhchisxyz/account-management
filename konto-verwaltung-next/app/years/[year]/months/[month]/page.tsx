import { getAllTransactionsInMonth, Transaction } from "@/app/lib/transaction-actions"
import Graph from "../../../../components/graph";
import { getRate } from "@/app/lib/currency-actions";
import { formatDate, formatEuro, formatVND } from "@/app/lib/formatterService";
import { TransactionsTable } from "@/app/components/table";
import { redirect } from "next/navigation";

export default async function MonthDetailsPage({
    params
}: {
    params: Promise<{month: string, year: string}>
}) {
    const {month, year} = await params
    const data = await Promise.all([
        getAllTransactionsInMonth(month, year),
        getRate()
    ])
    const transactions : Transaction[]= data[0]
    if (transactions.length === 0) return redirect(`/years/${year}`)
    const rate: number = data[1]
    return (
        <div className={`flex flex-col gap-4 w-full`}>
            <div className={`w-full h-full grid grid-cols-2 gap-10 flex-1`}>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={transactions.map(t => formatDate(t.date))}
                           dataset={transactions.map(t => t.value)}
                           currency={'EUR'}
                           title={`Analyse in ${month.toUpperCase()}, ${year}`}/>
                </div>
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Graph labels={transactions.map(t => formatDate(t.date))}
                           dataset={transactions.map(t => t.value * rate)}
                           currency={'VND'}
                           title={`Analyse in ${month.toUpperCase()}, ${year}`}/>
                </div>
            </div>
            <TransactionsTable transactions={transactions} month={month} year={year} rate={rate}/>
        </div>
    )
}