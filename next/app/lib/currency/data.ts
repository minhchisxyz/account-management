
import {CurrencyRate} from "../definitions";
import prisma from "../prisma";

const BASE_URL = `${process.env.VCB_URL as string}`

export async function getRate(): Promise<number> {
  const d = new Date()
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;
  const rates = await Promise.all([
    fetch(`${BASE_URL}${today}`),
    fetchRate()
  ])
  if (rates[1]) {
    const rate = rates[1].rate
    console.log(`Using the existing rate from database ${new Date().toISOString()}: ${rate}`)
    return rate
  }
  if (!rates[0].ok) {
    throw new Error("Failed to load currency rate");
  }
  const json = await rates[0].json() as { Data: { currencyCode: string, transfer: number }[] };
  const rate = json.Data.filter(item => item.currencyCode === 'EUR')[0].transfer
  console.log('hi')
  await saveRate(rate)
  return rate
}

export async function saveRate(rate: number) {
  try {
    console.log("Saving rate...")
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    return await prisma.currencyExchangeRate.create({
      data: {
        date: date,
        rate: Number(rate)
      }
    })
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to save rate.');
  }
}

export async function fetchRate() {
  try {
    console.log("Fetching rate...");
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    return await prisma.currencyExchangeRate.findFirst({
      where: {
        date: date
      }
    })
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch rate.');
  }
}

export async function fetchBalance() {
  try {
    console.log("Fetching balance...");
    return (await prisma.transaction.aggregate({
      _sum: {
        amount: true
      }
    }))._sum.amount ?? 0
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance.');
  }
}

export async function fetchAllRates() {
  try {
    await getRate()
    console.log("Fetching all rates...");
    return await prisma.currencyExchangeRate.findMany({
      select: {
        date: true,
        rate: true
      }
    }) as CurrencyRate[]
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch all rates.');
  }
}