import NavLinks, {StaticLink} from "./nav-links";
import {getMonthName} from "@/app/lib/formatterService";
import {fetchAllMonths, fetchAllYears} from "@/app/lib/transaction/data";
import {BadgeEuro, BanknoteArrowUp, House} from "lucide-react";

export async function YearNavigation() {
  const years: number[] = (await fetchAllYears()).map(y => y.year)
  const staticLinks: StaticLink[] = [
    {
      href: ``,
      icon: <House className={`h-full`}/>,
      tooltip: 'Home'
    },
    {
      href: `currency`,
      icon: <BadgeEuro className={`h-full`}/>,
      tooltip: 'Currency Exchange Rate'
    },
    {
      href: `transactions`,
      icon: <BanknoteArrowUp className={`h-full`}/>,
      tooltip: 'Create new transaction'
    }
  ]
  const links = years.map(year => ({label: String(year), href: `years/${year}`}))
  return (
      <NavLinks staticLinks={staticLinks}
                links={links}/>
  )
}

export async function MonthNavigation({ year } : { year: string } ) {
  const months: string[] = (await fetchAllMonths(parseInt(year))).map(m => getMonthName(m.month).toUpperCase())
  const links = months.map(month => ({
    href: `years/${year}/months/${month.toLowerCase()}`,
    label: month
  }))
  return (
      <NavLinks staticLinks={[]}
                links={links}/>
  )
}