import NavLinks, {StaticLink} from "./nav-links";
import Tooltip from "@mui/material/Tooltip";
import {ArrowTrendingUpIcon, BanknotesIcon, HomeIcon} from "@heroicons/react/24/outline";
import {getMonthName} from "@/app/lib/formatterService";
import {fetchAllMonths, fetchAllYears} from "@/app/lib/transaction/data";

export async function YearNavigation() {
  const years: number[] = (await fetchAllYears()).map(y => y.year)
  const staticLinks: StaticLink[] = [
    {
      href: ``,
      icon:
          <Tooltip title={`Home`} placement={`right`}>
            <HomeIcon className={`h-full`}/>
          </Tooltip>
    },
    {
      href: `currency`,
      icon:
          <Tooltip title={`Currency Exchange Rate`} placement={`right`}>
            <ArrowTrendingUpIcon className={`h-full`}/>
          </Tooltip>
    },
    {
      href: `transactions`,
      icon:
          <Tooltip title={`Create new transaction`} placement={`right`}>
            <BanknotesIcon className={`h-full`}/>
          </Tooltip>
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