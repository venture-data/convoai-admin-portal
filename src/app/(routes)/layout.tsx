import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex justify-between bg-white w-full min-h-screen overflow-hidden p-0">
      <div className="flex flex-col items-center justify-center flex-1 p-8 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E7EB_1px,transparent_1px),linear-gradient(to_bottom,#E5E7EB_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" style={{ maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 80%)' }}></div>
        <div className="w-full max-w-md relative z-10">
          <div className="flex justify-center">
            <Image src="/callspro.png" alt="ConvoiAI" width={198} height={44} className="mb-6" />
          </div>
          {children}
        </div>
      </div>
      
      <div className="flex-1 hidden sm:block w-full h-screen overflow-hidden">
        <Image 
          src="/Section.png" 
          alt="Dubbing Studio" 
          className="object-cover w-full h-full" 
          width={1000} 
          height={1000} 
        />
      </div>
    </div>
  );
} 