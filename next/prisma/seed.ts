import { PrismaPg } from "@prisma/adapter-pg";
import {PrismaClient} from "@/app/generated/prisma/client";
import bcrypt from 'bcrypt'

const VCB_URL = process.env.VCB_URL;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});
// typescript
const startDateStr = "2021-01-01"; // input your start date here (YYYY-MM-DD)

export async function main() {
  await prisma.user.create({
    data: {
      username: process.env.USER_NAME || 'admin',
      password: bcrypt.hashSync(process.env.PASSWORD || '', 12)
    }
  })
}

main().catch(console.error);
