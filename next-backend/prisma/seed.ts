import { PrismaPg } from "@prisma/adapter-pg";
import {PrismaClient} from "@/app/generated/prisma/client";

const VCB_URL = process.env.VCB_URL;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});
// typescript
const startDateStr = "2025-11-27"; // input your start date here (YYYY-MM-DD)

export async function main() {
  if (!VCB_URL) {
    throw new Error("VCB_URL env variable is not set");
  }

  const transactions = await prisma.transaction.findMany({})
  for (const transaction of transactions) {
    const date = new Date(transaction.date)
    date.setUTCHours(0, 0, 0, 0)
    const existingRate = await prisma.currencyExchangeRate.findFirst({
      where: {
        date: date,
      },
    });
    if (existingRate) {
      const rate= existingRate.rate
      console.log(`${date.toISOString()} Rate: ${rate}`)
      const amountVND = transaction.amountEUR * rate
      await prisma.transaction.update({
        where: {
          id: transaction.id
        },
        data: {
          amountVND: amountVND
        }
      })
      console.log(`Updated transaction ${transaction.id} with amountVND: ${amountVND}`)
    } else {
      console.log(`No rate found for ${date.toISOString()}`)
    }
  }
}

main().catch(console.error);
