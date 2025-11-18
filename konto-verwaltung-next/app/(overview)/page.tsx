import Graph from "../components/graph";
import {getRate } from "../lib/currency-actions";
import { formatEuro, formatVND } from "../lib/formatterService";
import {getAllYearTotals, getBalance, YearTotal } from "../lib/transaction-actions";

export default async function Home() {
    const data = await Promise.all([
        getBalance(),
        getRate(),
        getAllYearTotals()
    ])
    const balance: number = data[0]
    const rate: number = data[1]
    const totals : YearTotal[] = data[2]
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  return (
    <div className={"flex flex-col items-center w-full p-10 overflow-hidden min-h-screen"}>
        <div className={`text-4xl font-bold w-full flex justify-center items-center py-10 rounded-2xl backdrop-blur-xl ${shadow}`}>
            <span>
                Kontostand: { formatEuro(balance) } | { formatVND(balance * rate) }
            </span>
        </div>
        <div className={`w-full h-full grid grid-cols-2 gap-10 flex-1`}>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Graph labels={totals.map(t => t.year.toString())}
                       dataset={totals.map(t => t.total)}
                       currency={'EUR'}
                       title={`Jährliche Analyse in EUR`}/>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Graph labels={totals.map(t => t.year.toString())}
                       dataset={totals.map(t => t.total * rate)}
                       currency={'VND'}
                       title={`Jährliche Analyse in VND`}/>
            </div>
        </div>
    </div>
  );
}
