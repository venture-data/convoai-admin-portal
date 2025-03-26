"use client"

import DashboardLayout from "@/components/layout/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardLayout>{children}</DashboardLayout>
      </QueryClientProvider>
    </SessionProvider>
  );
}
