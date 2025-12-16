import {NextRequest, NextResponse} from "next/server";
import {fetchAllTransactionsOfMonth, fetchAllTransactionsOfMonthGroupByDate} from "@/app/lib/transaction/data";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ year: string, month: string }> }
) {
  const { year, month } = await params
  const grouped = request.nextUrl.searchParams.get('grouped')
  if (grouped) return NextResponse.json(await fetchAllTransactionsOfMonthGroupByDate(Number(year), Number(month)))
  return NextResponse.json(await fetchAllTransactionsOfMonth(Number(year), Number(month)))
}