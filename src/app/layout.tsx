import type { Metadata } from "next";
import "./globals.css";
import SessionProviderWrapper from "@/components/ui/sessionProviderWrapper";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "CallsPro",
  icons:{
    icon:"https://i.ibb.co/02BCrLx/HDkxcf1.png",
  },
  description: "AI-Powered Voice Sales Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
        <Toaster />
      </body>
    </html>
  )
}
