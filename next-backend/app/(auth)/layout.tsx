
import "../globals.css";
import {Suspense} from "react";
import {NavLinksSkeleton} from "@/components/skeletons";
import {YearNavigation} from "@/components/navigation";
import SignOutButton from "@/components/signout-button";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex flex-col md:flex-row w-screen h-screen max-w-screen overflow-hidden`}>
      <aside className="hidden md:block w-24 backdrop-blur-md">
        <nav className={`w-24 p-4 flex flex-col gap-4 h-full`}>
          <Suspense fallback={<NavLinksSkeleton />}>
            <YearNavigation />
          </Suspense>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col h-full">
        <nav
            className={`md:hidden w-screen flex-none p-4 flex flex-row gap-2 backdrop-blur-md overflow-x-auto overflow-y-hidden`}
        >
          <Suspense fallback={<NavLinksSkeleton />}>
            <YearNavigation />
          </Suspense>
        </nav>

        <main className={`flex-1 min-h-0 overflow-hidden`}>
          {children}
        </main>
      </div>
      <SignOutButton/>
    </div>
  );
}
