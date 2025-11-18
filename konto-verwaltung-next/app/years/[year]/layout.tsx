import NavLinks from "@/app/components/nav-links";
import { getAllMonths } from "@/app/lib/transaction-actions";
import { ReactNode } from "react";

export default async function Layout({
    params, children
}: {
    params: Promise<{year: string}>,
    children: ReactNode
}) {
    const { year } = await params;
    const months: string[] = await getAllMonths(year);
    return (
        <div className={`min-h-screen flex w-full`}>
            <nav className={`w-32 p-4 flex flex-col gap-4 min-h-screen`}>
                <NavLinks staticLinks={[]}
                          links={months.map(month => ({
                              href: `years/${year}/months/${month.toLowerCase()}`,
                              label: month
                          }))}/>
            </nav>
            <div className={`flex-1 p-5 w-full`}>
                {children}
            </div>
        </div>
    )
}