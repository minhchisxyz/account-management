
import {formatEuro, formatVND} from "@/app/lib/formatterService";
import Graph from "@/components/graph";
import {fetchYearTotals} from "@/app/lib/transaction/data";

export default async function Home() {
  const totals= await fetchYearTotals()
  const eurBalance: number = totals.reduce((a, b) => a + b.totalEUR, 0)
  const vndBalance: number = totals.reduce((a, b) => a + b.totalVND, 0)
  const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  return (
    <div className={"flex flex-col items-center w-full p-2 md:p-10 overflow-hidden min-h-screen"}>
      {/*Desktop*/}
      <div className={`hidden md:flex text-4xl font-bold w-full justify-center items-center py-10 rounded-2xl backdrop-blur-xl ${shadow}`}>
        <span className={`text-center w-full`}>
          Account Balance: { formatEuro(eurBalance) } | { formatVND(vndBalance) }
        </span>
      </div>
      {/*Mobile*/}
      <div className={`block md:hidden text-xl font-bold w-9/12 flex-col justify-center items-center text-center py-2 rounded-2xl backdrop-blur-xl ${shadow}`}>
        <div>
          Account Balance
        </div>
        <div>
          { formatEuro(eurBalance) }
        </div>
        <div>
          { formatVND(vndBalance) }
        </div>
      </div>
      <div className={`w-full md:h-full gap-2 pt-5 grid grid-cols-1 md:grid-cols-2 md:gap-10 md:flex-1`}>
        <div className="w-full h-fit md:h-full flex flex-col items-center justify-center">
          <Graph labels={totals.map(t => t.year.toString())}
                 dataset={totals.map(t => t.totalEUR)}
                 currency={'EUR'}
                 title={`Annual Analysis`}/>
        </div>
        <div className="w-full h-fit md:h-full flex flex-col items-center justify-center">
          <Graph labels={totals.map(t => t.year.toString())}
                 dataset={totals.map(t => t.totalVND)}
                 currency={'VND'}
                 title={`Annual Analysis`}/>
        </div>
      </div>
    </div>
  );
}
