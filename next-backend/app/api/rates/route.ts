import {NextRequest, NextResponse} from "next/server";
import {fetchAllRates, getRate} from "@/app/lib/currency/data";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get('filter')
  const today = request.nextUrl.searchParams.get('today')
  if (today) {
    return NextResponse.json(await getRate())
  }
  return NextResponse.json(await fetchAllRates(filter))
}