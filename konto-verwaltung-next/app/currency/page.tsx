'use client'

import {useMemo, useState } from "react"
import Graph from "../components/graph"
import {CurrencyRate } from "../lib/currency-actions"
import { formatDate } from "../lib/formatterService"

export default function CurrencyPage({rates}: {
    rates: CurrencyRate[]
}) {
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
    const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
    const linkClass = `flex items-center justify-center w-32 h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
    const activeClass = `shadow-none inset-shadow-[-4px_4px_8px_#cccccc,4px_-4px_6px_#ffffff]`
    const [filter, setFilter] = useState(7)
    const day = 1000 * 60 * 60 * 24
    const filteredRates = useMemo(() => {
        if (filter === 0) return rates
        const today = new Date()
        return rates.filter(r => today.getTime() - new Date(r.id.date).getTime() <= day * filter)
    }, [filter])
    const filters = [
        {
            label: 'Alle',
            value: 0
        },
        {
            label: '7 Tagen',
            value: 7
        },
        {
            label: 'Monat',
            value: 30
        },
        {
            label: '3 Monaten',
            value: 90
        },
        {
            label: '6 Monaten',
            value: 180
        },
        {
            label: '9 Monaten',
            value: 270
        },
        {
            label: 'Jahr',
            value: 365
        }
    ]
    return (
        <div className={"flex flex-col items-center justify-center w-full max-h-screen p-10"}>
            <div className={"flex flex-row items-center justify-center w-full p-2 gap-10"}>
                { filters.map(f => (
                    <button key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`${linkClass} ${filter === f.value ? activeClass : ''}`}>
                        {f.label}
                    </button>
                ))}
            </div>
            <Graph labels={filteredRates.map(r => formatDate(r.id.date))}
                   dataset={filteredRates.map(t => t.rate)}
                   currency={'VND'}
                   title={`Währungskurs`}/>
        </div>
    )
}