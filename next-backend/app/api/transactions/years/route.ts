import {NextRequest, NextResponse} from "next/server";
import {fetchAllYears, fetchYearTotals} from "@/app/lib/transaction/data";

export async function GET(request: NextRequest) {
  const total = request.nextUrl.searchParams.get('total')
  if (total) return NextResponse.json(await fetchYearTotals())
  return NextResponse.json((await fetchAllYears()).map(value => Number(value.year)))
}