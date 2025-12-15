import {NextResponse} from "next/server";
import {getTransaction} from "@/app/lib/transaction/data";

export async function GET({params}: { params: Promise<{ transactionId: string }>}) {
  const {transactionId} = await params
  return NextResponse.json(await getTransaction(Number(transactionId)))
}