'use server'

import {saveRate} from "@/app/lib/currency/data";

const BASE_URL = `${process.env.VCB_URL as string}`

let cachedRate: number | null = null;
let lastFetchTime: Date | null = null;

async function fetchCurrencyRate(): Promise<number> {
  const d = new Date()
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  const res = await fetch(`${BASE_URL}${today}`);
  if (!res.ok) {
      throw new Error("Failed to load currency rate");
  }
  const json = await res.json() as { Data: { currencyCode: string, transfer: number }[] };
  const rate = json.Data.filter(item => item.currencyCode === 'EUR')[0].transfer
  cachedRate = rate
  lastFetchTime = new Date();
  await saveRate(rate)
  return rate
}

export async function getRate(): Promise<number> {
    if (cachedRate !== null && lastFetchTime && lastFetchTime.getTime() + 1000 * 60 * 60 * 2 < new Date().getTime()) {
        return cachedRate;
    }
    return fetchCurrencyRate();
}