import TransactionForm from "@/components/transaction-form";

export default async function TransactionPage(props: {
  searchParams?: Promise<{
    id?: number;
    value?: number;
    description?: string;
    date?: string;
  }>;
}) {
  const searchParams = await props.searchParams
  const id = searchParams?.id
  const value = searchParams?.value
  const description = searchParams?.description
  const date = searchParams?.date
  return (
    <div className="flex pt-5 md:justify-center md:items-center h-screen px-5">
      <TransactionForm id={id} value={value} description={description} date={date}/>
    </div>
  )
}

