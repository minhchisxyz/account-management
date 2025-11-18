'use server'

const BASE_URL = `${process.env.BASE_URL as string}/currency`

let cachedRate: number | null = null;
let lastFetchTime: Date | null = null;

export type CurrencyRate = {
    id: {
      date: string
    },
    rate: number
}

export type Rates = {
    vcbRates: CurrencyRate[]
}

export async function fetchAllRates(): Promise<Rates> {
    const res = await fetch(`${BASE_URL}`);
    return res.json()
}

async function fetchCurrencyRate(): Promise<number> {
    const res = await fetch(`${BASE_URL}/today?bank=vcb`);
    if (!res.ok) {
        throw new Error("Failed to load currency rate");
    }
    const { rate } = (await res.json()) as CurrencyRate;
    cachedRate = rate
    lastFetchTime = new Date();
    return cachedRate;
}

export async function getRate(): Promise<number> {
    if (cachedRate !== null && lastFetchTime && lastFetchTime.getTime() + 1000 * 60 * 60 * 2 < new Date().getTime()) {
        return cachedRate;
    }
    return fetchCurrencyRate();
}