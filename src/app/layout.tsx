import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster"
import SessionProviderWrapper from "@/components/ui/sessionProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Convoi AI - Admin Dashboard",
  icons: {
    icon: "/cvai fevicon.png",
    shortcut: "/cvai fevicon.png",
    apple: "/cvai fevicon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/cvai-fevicon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/cvai-fevicon.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/cvai-fevicon.png",
      },
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
