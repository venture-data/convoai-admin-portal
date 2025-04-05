"use client"

import DashboardLayout from "@/components/layout/DashboardLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/app/hooks/useAuth";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  useEffect(() => {
    if(useAuthStore.getState().token === ""){
      if (session.data?.user) {
        useAuthStore.getState().setCreds({
          token: session.data.token || "",
        });
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayout>{children}</DashboardLayout>
    </QueryClientProvider>
  );
}
