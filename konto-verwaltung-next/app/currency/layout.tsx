import {fetchAllRates, Rates} from "../lib/currency-actions";
import CurrencyPage from "./page";

export default async function CurrencyLayout() {
    const { vcbRates: rates}: Rates = await fetchAllRates()
    return (
        <CurrencyPage rates={rates}/>
    )
}