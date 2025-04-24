import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster"
import SessionProviderWrapper from "@/components/ui/sessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Convoi AI - Admin Dashboard",
  icons: {
    icon: [
      {
        url: "/cvai-fevicon.png",
        type: "image/png",
      }
    ],
    shortcut: [
      {
        url: "/cvai-fevicon.png",
        type: "image/png",
      }
    ],
    apple: [
      {
        url: "/cvai-fevicon.png",
        sizes: "180x180",
        type: "image/png",
      }
    ],
  },
  description: "Convoi AI - Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  )
}
