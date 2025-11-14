import { HomeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getAllYears } from "../lib/transaction-api";

export default async function MainNavigation() {
  const years = await getAllYears()
  console.log(years)
  return (
    <aside className="w-24 bg-white/15 p-4 space-y-4">
      <nav className="space-y-2">
        <Link href="" className="block rounded px-3 py-2 h-2">
          <HomeIcon/>
        </Link>
        <a href="#reports" className="block rounded px-3 py-2 hover:bg-slate-800">
          Reports
        </a>
        <a href="#settings" className="block rounded px-3 py-2 hover:bg-slate-800">
          Settings
        </a>
      </nav>
    </aside>
  )
}
