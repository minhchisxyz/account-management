import {NextRequest, NextResponse} from "next/server";
import {fetchAllRates} from "@/app/lib/currency/data";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get('filter')
  const rates = await fetchAllRates(filter)
  return NextResponse.json(rates)
}