import {Suspense} from "react";
import {fetchAllMonthTotals} from "@/app/lib/transaction/data";
import {getMonthName} from "@/app/lib/formatterService";
import Graph from "@/components/graph";
import {MonthsTable} from "@/components/table";

export default async function YearDetailsPage({
  params
}: {
  params: Promise<{year: number}>,
}) {
  const { year } = await params;
  const totals = (await fetchAllMonthTotals(year)).map(t => ({...t, month: getMonthName(t.month).toUpperCase()}));
  return (
    <div className="flex h-screen w-full justify-center px-4 sm:px-6 lg:px-10 py-4 overflow-hidden">
      <div className="flex min-h-0 w-full max-w-6xl flex-col gap-4 flex-1">
        <div className="w-full flex-none">
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div className="w-full flex flex-col items-center justify-center">
              <Suspense fallback={<div>Loading...</div>}>
                <Graph
                  labels={totals.map((t) => t.month)}
                  dataset={totals.map((t) => t.totalEUR)}
                  currency={"EUR"}
                  title={`Monthly Analysis in ${year}`}
                />
              </Suspense>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <Graph
                labels={totals.map((t) => t.month)}
                dataset={totals.map((t) => t.totalVND)}
                currency={"VND"}
                title={`Monthly Analysis in ${year}`}
              />
            </div>
          </div>
        </div>

        {/* table area takes remaining height and scrolls internally */}
        <div className="w-full flex-1 min-h-0">
          <MonthsTable totals={totals}/>
        </div>
      </div>
    </div>
  )
}

