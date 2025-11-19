
import {CurrencyRate} from "@/app/lib/definitions";
import CurrencyContentPage from "@/app/components/currency-content-page";
import {fetchAllRates} from "@/app/lib/currency/data";

export default async function CurrencyLayout() {
    const rates: CurrencyRate[] = await fetchAllRates()
    return (
        <CurrencyContentPage rates={rates}/>
    )
}