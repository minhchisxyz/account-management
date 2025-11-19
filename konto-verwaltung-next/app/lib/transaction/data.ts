import postgres from "postgres";
import {GroupedTransactions, MonthTotal, Transaction, YearTotal} from "@/app/lib/definitions";

const sql = postgres(process.env.POSTGRES_URL!, {});

export async function removeTransaction(id: number) {
  try {
    console.log("Deleting transaction...");
    await sql`DELETE FROM transaction WHERE id = ${id}`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to delete transaction.');
  }
}

export async function editTransaction(id: number, value: number, description: string, date: Date = new Date()) {
  try {
    console.log("Editing transaction...");
    await sql`
    UPDATE transaction 
    SET value = ${value}, description = ${description}, last_modified = NOW() , date = ${date}
    WHERE id = ${id}
    `
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to edit transaction.');
  }
}

export async function saveTransaction(value: number, description: string, date: Date = new Date()) {
  try {
    console.log("Saving transaction...");
    await sql`INSERT INTO transaction (date, description, value, last_modified) VALUES (${date}, ${description}, ${value}, NOW())`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to save transaction.');
  }
}

export async function fetchYearTotals() {
  try {
    console.log("Fetching year totals...");
    return await sql<YearTotal[]>`
            SELECT
                EXTRACT(YEAR FROM date) AS year,
                SUM(value) AS total
            FROM transaction
            GROUP BY EXTRACT(YEAR FROM date)
            ORDER BY year`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch year totals.');
  }
}

export async function fetchAllYears() {
  try {
    console.log("Fetching all years...");
    return await sql<{year: number}[]>`
        SELECT
            DISTINCT (EXTRACT(YEAR FROM date)) AS year
        FROM transaction
        ORDER BY year`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch all years.');
  }
}

export async function fetchAllMonths(year: number) {
  try {
    console.log(`Fetching all months for year ${year}...`);
    return await sql<{month: number}[]>`
        SELECT DISTINCT(EXTRACT(MONTH FROM date)) AS month
        FROM transaction
        WHERE EXTRACT(YEAR FROM date) = ${year}
        ORDER BY month`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all months for year ${year}...`);
  }
}

export async function fetchAllMonthTotals(year: number) {
  try {
    console.log(`Fetching all months for year ${year}...`);
    return await sql<MonthTotal[]>`
        SELECT
            EXTRACT(MONTH FROM date) AS month,
            SUM(value) AS total
        FROM transaction
        WHERE EXTRACT(YEAR FROM date) = ${year}
        GROUP BY month
        ORDER BY month`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all months for year ${year}...`);
  }
}

export async function fetchAllTransactionsOfMonth(year: number, month: number) {
  try {
    console.log(`Fetching all transactions for month ${month} of year ${year}...`);
    return await sql<Transaction[]>`
        SELECT
            id,
            date,
            description,
            value
        FROM transaction
        WHERE EXTRACT(YEAR FROM date) = ${year} AND EXTRACT(MONTH FROM date) = ${month}
        ORDER BY date`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all transactions for month ${month} of year ${year}...`);
  }
}

export async function fetchAllTransactionsOfMonthGroupByDate(year: number, month: number) {
  try {
    console.log(`Fetching all grouped by date transactions for month ${month} of year ${year}...`);
    return await sql<GroupedTransactions[]>`
        SELECT
            SUM(value),
            date
        FROM transaction
        WHERE EXTRACT(YEAR FROM date) = ${year} AND EXTRACT(MONTH FROM date) = ${month}
        GROUP BY date
        ORDER BY date`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all grouped by date transactions for month ${month} of year ${year}...`);
  }
}