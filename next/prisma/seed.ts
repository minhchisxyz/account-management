import { PrismaPg } from "@prisma/adapter-pg";
import {PrismaClient} from "../../../mchisxyz/app/account-management/generated/prisma/client";
import postgres from "postgres";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

const sql = postgres(process.env.POSTGRES_URL!, {});

export async function main() {
  const transactions = await sql`SELECT value, date, description FROM transaction ORDER BY date`
  for (const transaction of transactions) {
    const date = transaction.date
    date.setUTCHours(0, 0, 0, 0)
    await prisma.transaction.create({
      data: {
        date: date,
        amount: transaction.value,
        description: transaction.description
      }
    })
    console.log(`Create ${date.toISOString()} : ${transaction.value}, ${transaction.description}`)
  }
}

main().catch(console.error)