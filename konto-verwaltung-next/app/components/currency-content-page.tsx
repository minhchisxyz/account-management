'use client'

import {useMemo, useState } from "react"
import Graph from "./graph"
import {formatDate, formatVND} from "../lib/formatterService"
import {CurrencyRate} from "@/app/lib/definitions";
import {EuroIcon, VietnamIcon} from "@/app/components/icons";

export default function CurrencyContentPage({rates}: {
    rates: CurrencyRate[]
}) {
  const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
  const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
  const linkClass = `flex items-center justify-center w-32 h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
  const activeClass = `shadow-none inset-shadow-[-4px_4px_8px_#cccccc,4px_-4px_6px_#ffffff]`
  const focusClass = `focus:shadow-none focus:inset-shadow-[4px_4px_8px_#cccccc,-4px_-4px_6px_#ffffff] focus:outline-none`
  const [filter, setFilter] = useState(7)
  const day = 1000 * 60 * 60 * 24
  const filteredRates = useMemo(() => {
      if (filter === 0) return rates
      const today = new Date()
      return rates.filter(r => today.getTime() - r.date.getTime() <= day * filter)
  }, [filter, rates, day])
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
  const rate = filteredRates[filteredRates.length - 1]?.rate ?? 0
  return (
      <div className={"flex flex-col items-center justify-center w-full max-h-screen p-10 gap-10"}>
          <div>
            <div className={"flex flex-row items-center justify-center w-full p-2 gap-10"}>
              { filters.map(f => (
                  <button key={f.value}
                          onClick={() => setFilter(f.value)}
                          className={`${linkClass} ${filter === f.value ? activeClass : ''}`}>
                    {f.label}
                  </button>
              ))}
            </div>
            <Graph labels={filteredRates.map(r => formatDate(r.date))}
                   dataset={filteredRates.map(t => t.rate)}
                   currency={'VND'}
                   title={`Currency Exchange Rate`}/>
          </div>
        <div className={`w-full flex flex-col items-center justify-center gap-5`}>
          <h1 className={`text-bold text-4xl`}>Quick Conversion</h1>
          <div className={`w-full flex flex-row gap-16 items-center justify-center`}>
            <div className={`flex flex-row gap-1 items-center justify-center`}>
              <EuroIcon/>
              <input value={amount}
                     onChange={e => setAmount(Number(e.target.value))}
                     type="number"
                     className={`${linkClass} ${focusClass}`}/>
            </div>
            <div className={`flex flex-row gap-1 items-center justify-center`}>
              <VietnamIcon/>
              <button className={linkClass}>
                { formatVND(amount * rate) }
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}