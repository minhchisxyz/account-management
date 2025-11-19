import postgres from "postgres";
import {CurrencyRate} from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {});
const vcb = 1

export async function saveRate(rate: number) {
  try {
    console.log("Saving rate...");
    const now = new Date();
    const currentRate = await sql<{rate: number}[]>`
            SELECT rate 
            FROM currency_exchange_rate 
            WHERE bank = ${vcb} AND 
                  EXTRACT(YEAR FROM date) = ${now.getFullYear()} AND 
                  EXTRACT(MONTH FROM date) = ${now.getMonth() + 1} AND 
                  EXTRACT(DAY FROM date) = ${now.getDate()}`
    if (currentRate.length > 0) {
      console.log("Rate already exists. Updating...");
      await sql`UPDATE currency_exchange_rate SET rate = ${rate} WHERE bank = ${vcb} AND date = NOW()`
    }
    else {
      console.log("Rate does not exist. Inserting...");
      await sql`INSERT INTO currency_exchange_rate (bank, date, rate) VALUES (${vcb}, NOW(), ${rate})`
    }
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to save rate.');
  }
}

export async function fetchBalance() {
  try {
    console.log("Fetching balance...");
    const data = await sql<{sum: number}[]>`SELECT SUM(value) FROM transaction`
    return data[0].sum
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch balance.');
  }
}

export async function fetchRate() {
  try {
    console.log("Fetching today rate...");
    const data = await sql<{rate: number}[]>`SELECT rate FROM currency_exchange_rate ORDER BY date DESC LIMIT 1`
    return data[0].rate
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch rate.');
  }
}

export async function fetchAllRates() {
  try {
    console.log("Fetching all rates...");
    return await sql<CurrencyRate[]>`
            SELECT 
                date, 
                rate
            FROM currency_exchange_rate
            WHERE bank = ${vcb}
            ORDER BY date`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch all rates.');
  }
}