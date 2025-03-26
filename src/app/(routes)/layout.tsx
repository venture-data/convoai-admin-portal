import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-orange-600/20 to-red-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="w-full max-w-[420px] mx-4 backdrop-blur-xl bg-[#1A1D25]/70 rounded-2xl p-8 shadow-2xl border border-white/10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-white mb-2">ConvoiAI</h1>
          {children}
        </div>
      </div>
    </div>
  );
} 