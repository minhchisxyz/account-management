
import {CurrencyRate} from "../definitions";
import prisma from "../prisma";

const BASE_URL = `${process.env.VCB_URL as string}`

export async function getRate(dateStr?: string): Promise<number> {
  if (dateStr) {
    const date = new Date(dateStr)
    date.setUTCHours(0, 0, 0, 0)
    const rate = await prisma.currencyExchangeRate.findFirst({
      where: {
        date: date
      }
    })
    if (!rate) throw new Error('Rate not found')
    return rate.rate
  }
  const today = new Date().toISOString().slice(0, 10)
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
  await saveRate(Number(rate))
  return rate
}

export async function saveRate(rate: number) {
  try {
    console.log("Saving rate...")
    const date = new Date()
    date.setUTCHours(0, 0, 0, 0)
    return await prisma.currencyExchangeRate.upsert({
      where: {
        date: date
      },
      update: {
        rate: Number(rate)
      },
      create: {
        date: date,
        rate: rate
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

export async function fetchAllRates(filter: string | null) {
  try {
    await getRate()
    if (filter) {
      console.log(`Fetching all rates in ${filter} days...`);
      const days = parseInt(filter)
      const date = new Date(new Date().getTime() - days * 24 * 60 * 60 * 1000)
      date.setUTCHours(0, 0, 0, 0)
      return await prisma.currencyExchangeRate.findMany({
        where: {
          date: {
            gte: date
          }
        },
        select: {
          date: true,
          rate: true
        },
        orderBy: {
          date: 'asc'
        }
      }) as CurrencyRate[]
    } else {
      console.log("Fetching all rates...");
      return await prisma.currencyExchangeRate.findMany({
        select: {
          date: true,
          rate: true
        },
        orderBy: {
          date: 'asc'
        }
      }) as CurrencyRate[]
    }
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch all rates.');
  }
}