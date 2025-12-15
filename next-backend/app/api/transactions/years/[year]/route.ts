import {NextRequest, NextResponse} from "next/server";
import {fetchAllMonths, fetchAllMonthTotals} from "@/app/lib/transaction/data";

export async function GET(request: NextRequest, {params}: {params: Promise<{year: string}>}) {
  const {year} = await params
  const total = request.nextUrl.searchParams.get('total')
  if (total) return NextResponse.json(await fetchAllMonthTotals(Number(year)))
  return NextResponse.json((await fetchAllMonths(Number(year))).map(value => value.month))
}