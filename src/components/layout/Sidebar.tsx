"use client"

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { CircleHelpIcon } from "lucide-react";
import { useIsMobile } from "@/app/hooks/use-mobile";
import { useMobileMenu } from "@/store/use-mobile-menu";

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const { isOpen: isMobileOpen, setIsOpen: setIsMobileOpen } = useMobileMenu();

  return (
    <SidebarWrapper>
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 !bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <nav className={cn(
        "fixed w-60 h-screen bg-gray-900/40 backdrop-blur-xl border-r border-white/10 flex flex-col z-50",
        isMobile ? (
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        ) : 'translate-x-0',
        "transition-transform duration-300 ease-in-out"
      )}>
        <div className="px-5 py-4 border-b border-white/10">
          <h1 className="text-base font-bold bg-gradient-to-r from-[#F97316] to-[#EF4444] bg-clip-text text-transparent">
            ConvoiAI
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-3 scrollbar-thin">
          <style jsx global>{`
            .scrollbar-thin::-webkit-scrollbar {
              width: 2px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
            }

            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(255, 255, 255, 0.2);
            }

            /* For Firefox */
            .scrollbar-thin {
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
            }
          `}</style>
          <div>
            {navigationItems.map((section) => (
              <div className="mb-4" key={section.header}>
                <p className="text-[10px] text-gray-500 mb-1.5 px-2 uppercase tracking-wider">{section.header}</p>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center px-2 py-1.5 text-[13px] rounded-lg",
                        pathname === item.url
                          ? "text-white font-bold bg-[#F97316]/5"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4",
                        pathname === item.url
                          ? "stroke-[#F97316] stroke-[2]"
                          : "stroke-current stroke-[1.5]"
                      )} />
                      <span className="ml-2">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 px-3 py-1">
          <Link 
            href="/help"
            onClick={() => isMobile && setIsMobileOpen(false)}
            className="flex items-center px-2 py-1.5 text-[13px] text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
          >
            <CircleHelpIcon className="w-4 h-4" />
            <span className="ml-2">Help Center</span>
          </Link>
          <div className="flex items-center px-2 py-1.5 mt-1">
            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-[11px] font-medium text-white">
                {session?.user?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="ml-2">
              <p className="text-[12px] text-white">{session?.user?.name || 'Salman Aziz'}</p>
              <p className="text-[10px] text-gray-500">Admin</p>
              <Link href='#' onClick={async () => {
                  await signOut({ callbackUrl: "/" });
                }}>
                <span className="text-[10px] text-gray-500">Sign Out</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </SidebarWrapper>
  );
}

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
} 