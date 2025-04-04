import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster"
import SessionProviderWrapper from "@/components/ui/sessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calls Pro",
  icons:{
    icon:"https://i.ibb.co/02BCrLx/HDkxcf1.png",
  },
  description: "Voice assistant configuration",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  )
}
