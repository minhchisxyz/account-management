'use client'

import { createTransaction } from "../lib/transaction-actions";

export default function TransactionForm() {
    const shadow = 'shadow-[4px_4px_8px_#dddddd,-4px_-4px_6px_#ffffff]'
    const hover = 'hover:shadow-none hover:inset-shadow-[-4px_4px_8px_#dddddd,4px_-4px_6px_#ffffff] hover:cursor-pointer'
    const linkClass = `flex items-center justify-center w-full h-9 px-2 py-1 rounded-md bg-white/15 backdrop-blur-md ${shadow} ${hover}`
    return (
        <form
            className="flex flex-col gap-4 max-w-md w-full"
            action={createTransaction}
        >
            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Amount</label>
                <input
                    type="number"
                    className="border rounded px-3 py-2"
                    name="value"
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Description</label>
                <input
                    type="text"
                    className="border rounded px-3 py-2"
                    name={`description`}
                />
            </div>

            <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Date</label>
                <input
                    type="date"
                    className="border rounded px-3 py-2"
                    name={`date`}
                />
            </div>

            <button
                type="submit"
                className={linkClass}
            >
                Create transaction
            </button>
        </form>
    );
}
