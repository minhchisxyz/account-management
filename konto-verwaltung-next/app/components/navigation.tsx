import {ArrowTrendingUpIcon, BanknotesIcon, HomeIcon} from "@heroicons/react/24/outline"
import {getAllYears, YearTotal} from "../lib/transaction-actions"
import NavLinks from "./nav-links"
import {ReactNode} from "react"
import Tooltip from "@mui/material/Tooltip"

export type StaticLink = {
    href: string,
    icon: ReactNode
}

export type DynamicLink = {
    label: string,
    href: string
}

export default async function Navigation() {
    const years: number[] = await getAllYears()
    const staticLinks: StaticLink[] = [
        {href: ``, icon: <Tooltip title={`Home`} placement={`right`}><HomeIcon className={`h-full`}/></Tooltip>},
        {href: `currency`, icon: <ArrowTrendingUpIcon className={`h-full`}/>},
        {href: `transactions`, icon: <BanknotesIcon className={`h-full`}/>}
    ]
    return (
        <nav className={`w-full p-4 flex flex-col gap-4 min-h-screen`}>
            <NavLinks staticLinks={staticLinks}
                      links={years.map(year => ({label: String(year), href: `years/${year}`}))}/>
        </nav>
    )
}
