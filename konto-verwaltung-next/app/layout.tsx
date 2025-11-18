import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {getAllYears} from "./lib/transaction-actions";
import NavLinks, { StaticLink } from "./components/nav-links";
import {ArrowTrendingUpIcon, BanknotesIcon, HomeIcon} from "@heroicons/react/24/outline"
import Tooltip from "@mui/material/Tooltip"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Account Management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const years: number[] = await getAllYears()
    const staticLinks: StaticLink[] = [
        {
            href: ``,
            icon:
                <Tooltip title={`Home`} placement={`right`}>
                    <HomeIcon className={`h-full`}/>
                </Tooltip>
        },
        {
            href: `currency`,
            icon:
                <Tooltip title={`Currency Exchange Rate`} placement={`right`}>
                    <ArrowTrendingUpIcon className={`h-full`}/>
                </Tooltip>
        },
        {
            href: `transactions`,
            icon:
                <Tooltip title={`Create new transaction`} placement={`right`}>
                    <BanknotesIcon className={`h-full`}/>
                </Tooltip>
        }
    ]
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={`flex max-w-screen min-h-screen w-screen h-screen overflow-x-hidden`}>
            <aside className="w-24 backdrop-blur-md">
                <nav className={`w-full p-4 flex flex-col gap-4 min-h-screen`}>
                    <NavLinks staticLinks={staticLinks}
                              links={years.map(year => ({label: String(year), href: `years/${year}`}))}/>
                </nav>
            </aside>
            <main className={`flex-1`}>
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}
