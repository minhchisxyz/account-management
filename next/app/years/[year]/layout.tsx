import {ReactNode, Suspense} from "react";
import {NavLinksSkeleton} from "@/app/ui/skeletons";
import {MonthNavigation} from "@/app/ui/navigation";

export default async function Layout({
    params, children
}: {
    params: Promise<{year: string}>,
    children: ReactNode
}) {
  const { year } = await params;
  return (
    <div className={`md:min-h-screen flex flex-col md:flex-row w-full`}>
      <nav className={`w-full md:w-36 p-4 flex md:flex-col gap-2 overflow-x-auto h-fit md:h-screen`}>
        <Suspense fallback={<NavLinksSkeleton/>}>
          <MonthNavigation year={year}/>
        </Suspense>
      </nav>
      <div className={`flex-1 p-4 w-full`}>
          {children}
      </div>
    </div>
  )
}