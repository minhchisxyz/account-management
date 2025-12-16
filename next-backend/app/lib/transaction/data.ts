
import {GroupedTransactions, MonthTotal, Transaction, YearTotal} from "../definitions";
import prisma from "../prisma";

export async function getTransaction(id: number) {
  try {
    console.log(`Fetching transaction ${id}...`)
    return await prisma.transaction.findUnique({
      where: {
        id: id
      }
    })
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Failed to fetch transaction ${id}.`);
  }
}

export async function deleteTransaction(id: number) {
  try {
    console.log("Deleting transaction...");
    await prisma.transaction.delete({
      where: {
        id: id
      }
    })
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to delete transaction.');
  }
}

export async function editTransaction(id: number, value: number, description: string, date: Date = new Date()) {
  try {
    console.log("Editing transaction...");
    return await prisma.transaction.update({
      where: {
        id: id
      },
      data: {
        amount: value,
        description: description,
        date: date
      }
    })
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to edit transaction.');
  }
}

export async function saveTransaction(amount: number, description: string, date: Date = new Date()) {
  try {
    console.log("Saving transaction...");
    const transaction = await prisma.transaction.create({
      data: {
        amount: amount,
        description: description,
        date: date
      }
    })
    console.log(`Saved transaction ${date.toISOString()} : ${amount}, ${description}`)
    return transaction
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to save transaction.');
  }
}

export async function fetchYearTotals() {
  try {
    console.log("Fetching year totals...");
    return await prisma.$queryRaw<YearTotal[]>`
            SELECT
                EXTRACT(YEAR FROM date) AS year,
                SUM(amount) AS total
            FROM "Transaction"
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
    return await prisma.$queryRaw<{year: number}[]>`
        SELECT
            DISTINCT (EXTRACT(YEAR FROM date)) AS year
        FROM "Transaction"
        ORDER BY year`
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error('Failed to fetch all years.');
  }
}

export async function fetchAllMonths(year: number) {
  try {
    console.log(`Fetching all months for year ${year}...`);
    return await prisma.$queryRaw<{month: number}[]>`
        SELECT DISTINCT(EXTRACT(MONTH FROM date)) AS month
        FROM "Transaction"
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
    return await prisma.$queryRaw<MonthTotal[]>`
        SELECT
            EXTRACT(MONTH FROM date) AS month,
            SUM(amount) AS total
        FROM "Transaction"
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
    return await prisma.transaction.findMany({
      where: {
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1, 0, 0, 0, 0)
        }
      },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      }
    }) as Transaction[]
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all transactions for month ${month} of year ${year}...`);
  }
}

export async function fetchAllTransactionsOfMonthGroupByDate(year: number, month: number) {
  try {
    console.log(`Fetching all grouped by date transactions for month ${month} of year ${year}...`);
    return (await prisma.transaction.groupBy({
      by: ['date'],
      where: {
        date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1, 0, 0, 0, 0)
        }
      },
      _sum: {
        amount: true
      },
      orderBy: [{
        date: 'asc'
      }]
    })).map(group => ({
      date: group.date,
      total: group._sum.amount ?? 0
    })) as GroupedTransactions[]
  } catch (error) {
    console.log('Database Error:', error);
    throw new Error(`Fetching all grouped by date transactions for month ${month} of year ${year}...`);
  }
}