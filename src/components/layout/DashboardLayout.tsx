"use client"

import Sidebar from "@/components/layout/Sidebar";
import TransitionEffect from "../ui/transitioneffect";

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F1117] text-white relative">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 md:ml-60">
          <TransitionEffect>
            {children}
          </TransitionEffect>
        </main>
      </div>
    </div>
  );
}