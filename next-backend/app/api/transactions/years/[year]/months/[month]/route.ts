import {NextResponse} from "next/server";
import {fetchAllTransactionsOfMonth} from "@/app/lib/transaction/data";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ year: string, month: string }> }
) {
  const { year, month } = await params
  return NextResponse.json(await fetchAllTransactionsOfMonth(Number(year), Number(month)))
}