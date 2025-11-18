import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "./components/navigation";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={`flex max-w-screen min-h-screen w-screen h-screen overflow-x-hidden`}>
            <aside className="w-24 backdrop-blur-md">
                <Navigation/>
            </aside>
            <main className={`flex-1`}>
                {children}
            </main>
        </div>
      </body>
    </html>
  );
}
