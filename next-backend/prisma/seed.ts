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

  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) {
    throw new Error(`Invalid start date: ${startDateStr}`);
  }

  // normalize start date to UTC 00:00
  startDate.setUTCHours(0, 0, 0, 0);

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  let current = new Date(startDate);

  while (current <= today) {
    // ensure current is always normalized to UTC midnight
    current.setUTCHours(0, 0, 0, 0);

    // check if rate for this date already exists
    const existingRate = await prisma.currencyExchangeRate.findFirst({
      where: {
        date: current,
      },
    });

    if (!existingRate) {
      const dateStr = current.toISOString().slice(0, 10); // YYYY-MM-DD
      const url = `${VCB_URL}${dateStr}`;

      const response = await fetch(url);
      if (!response.ok) {
        console.error(`Failed to fetch rate for ${dateStr}: ${response.status} ${response.statusText}`);
      } else {
        const json = await response.json() as { Data: { currencyCode: string, transfer: string }[] };
        const rate = json.Data.filter(item => item.currencyCode === 'EUR')[0].transfer

        // TODO: adapt to real response fields
        const created = await prisma.currencyExchangeRate.create({
          data: {
            date: current,
            rate: parseFloat(rate), // change this based on your API / schema
            // ...other fields you need
          },
        });

        console.log(
            `Created rate for ${current.toISOString()}: rate=${created.rate}`
        );
      }
    } else {
      console.log(`Rate already exists for ${current.toISOString()}`);
    }

    // move to next day
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }
}

main().catch(console.error);
