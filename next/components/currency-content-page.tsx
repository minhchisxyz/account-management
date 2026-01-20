'use client'

import {useEffect, useState} from "react"
import Graph from "./graph"
import {EuroIcon, VietnamIcon} from "./icons";
import {formatDate, formatVND} from "@/app/lib/formatterService";
import {CurrencyRate} from "@/app/lib/definitions";
import {fetchAllRates} from "@/app/lib/currency/data";

export default function CurrencyContentPage() {
  const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
  const linkClass = `flex items-center justify-center w-32 h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
  const activeClass = `shadow-none inset-shadow-[-4px_4px_8px_#cccccc,4px_-4px_6px_#ffffff]`
  const focusClass = `focus:shadow-none focus:inset-shadow-[4px_4px_8px_#cccccc,-4px_-4px_6px_#ffffff] focus:outline-none`
  const [filter, setFilter] = useState(7)
  const [rates, setRates] = useState<CurrencyRate[]>([])

  useEffect(() => {
    fetchAllRates(filter)
        .then(setRates)
  }, [filter])

  const filters = [
    {
      label: 'All',
      value: 0
    },
    {
      label: 'A Week',
      value: 7
    },
    {
      label: 'A Month',
      value: 30
    },
    {
      label: '3 Months',
      value: 90
    },
    {
      label: '6 Months',
      value: 180
    },
    {
      label: '9 Months',
      value: 270
    },
    {
      label: 'A Year',
      value: 365
    }
  ]
  const [amount, setAmount] = useState(1)
  const rate = rates.at(-1)?.rate ?? 0
  return (
      <div className={"flex flex-col items-center justify-start w-full max-h-screen py-4 px-4 md:px-10 gap-10"}>
        {/* top block: filters + graph */}
        <div className={"w-full max-w-5xl mx-auto overflow-x-auto"}>
          <div className={"w-full flex flex-row flex-wrap md:flex-nowrap items-center justify-center p-2 gap-3 sm:gap-4 md:gap-6"}>
            {filters.map((f) => (
                <button
                    key={f.value}
                    onClick={() => {
                      setFilter(f.value)
                    }}
                    className={`${linkClass} ${filter === f.value && activeClass}`}
                >
                  {f.label}
                </button>
            ))}
          </div>
          <Graph
              labels={rates.map((r) => formatDate(r.date))}
              dataset={rates.map((t) => t.rate)}
              currency={"VND"}
              title={`Currency Exchange Rate`}
          />
        </div>

        {/* bottom block: quick conversion */}
        <div className={"w-full max-w-3xl mx-auto flex flex-col items-center justify-center gap-5 px-2"}>
          <h1 className={"font-bold text-2xl sm:text-3xl md:text-4xl text-center"}>
            Quick Conversion
          </h1>
          <div className={"w-full flex flex-col md:flex-row gap-6 md:gap-16 items-center justify-center"}>
            <div className={"w-full md:w-auto flex flex-row gap-2 items-center justify-center"}>
              <EuroIcon/>
              <input
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  type="number"
                  className={`${linkClass} ${focusClass} max-w-xs w-64 text-center`}
              />
            </div>
            <div className={"w-full md:w-auto flex flex-row gap-2 items-center justify-center"}>
              <VietnamIcon/>
              <button className={`${linkClass} max-w-xs w-64`}>
                {formatVND(amount * rate)}
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}