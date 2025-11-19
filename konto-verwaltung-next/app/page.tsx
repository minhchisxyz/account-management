import Graph from "./components/graph";
import { formatEuro, formatVND } from "./lib/formatterService";
import {fetchYearTotals} from "@/app/lib/transaction/data";
import {YearTotal} from "@/app/lib/definitions";
import {getRate} from "@/app/lib/currency/actions";
import {fetchBalance} from "@/app/lib/currency/data";

export default async function Home() {
    const data = await Promise.all([
        fetchBalance(),
        getRate(),
        fetchYearTotals(),
    ])
    const balance: number = data[0]
    const rate: number = data[1]
    const totals : YearTotal[] = data[2]
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  return (
    <div className={"flex flex-col items-center w-full p-10 overflow-hidden min-h-screen"}>
        <div className={`text-4xl font-bold w-full flex justify-center items-center py-10 rounded-2xl backdrop-blur-xl ${shadow}`}>
            <span>
                Account Balance: { formatEuro(balance) } | { formatVND(balance * rate) }
            </span>
        </div>
        <div className={`w-full h-full grid grid-cols-2 gap-10 flex-1`}>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Graph labels={totals.map(t => t.year.toString())}
                       dataset={totals.map(t => t.total)}
                       currency={'EUR'}
                       title={`Annual Analysis`}/>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-center">
                <Graph labels={totals.map(t => t.year.toString())}
                       dataset={totals.map(t => t.total * rate)}
                       currency={'VND'}
                       title={`Annual Analysis`}/>
            </div>
        </div>
    </div>
  );
}
