import {CurrencyRate} from "@/app/lib/definitions";
import {fetchAllRates} from "@/app/lib/currency/data";
import CurrencyContentPage from "@/components/currency-content-page";

export default async function CurrencyLayout() {
  const rates: CurrencyRate[] = await fetchAllRates()
  return (
      <CurrencyContentPage rates={rates}/>
  )
}