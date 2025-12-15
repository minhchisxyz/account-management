import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get('filter')
  return NextResponse.json({filter})
}