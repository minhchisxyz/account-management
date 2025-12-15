import {fetchRate} from "@/app/lib/currency/data";
import {NextResponse} from "next/server";

export async function GET() {
  const rate = await fetchRate()
  return NextResponse.json(rate)
}