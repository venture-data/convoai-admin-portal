"use client"
import { ArrowLeft, BarChart, Calendar, ChevronDown, ChevronRight, Contact2, Headphones, LayoutDashboard, MessageSquare, Settings, Users, Menu } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useIsMobile } from "@/app/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Schedule Calls",
    url: "/dashboard/schedule",
    icon: Calendar,
    children: [
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
      },
      {
        title: "New Campaigns",
        url: "/dashboard/new_campaigns",
      }
    ],
    hasDropdown: true
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart,
    hasDropdown: false
  },
  {
    title: "Agents",
    url: "/dashboard/agents",
    icon: Users,
    hasDropdown: true,
    children: [
      {
        title: "My Agents",
        url: "/dashboard/agents",
      },
      {
        title: "New Agents",
        url: "/dashboard/new_agents",
      }
    ]
  },
  {
    title: "Call Log",
    url: "/dashboard/calls",
    icon: Headphones,
  },
  {
    title: "Contacts",
    url: "/dashboard/contacts",
    icon: Contact2,
    hasDropdown: true
  },
  {
    title: "My Plan",
    url: "/dashboard/plan",
    icon: LayoutDashboard,
    hasDropdown: true
  },
  {
    title: "Admin Portal",
    url: "/dashboard/admin",
    icon: Users,
    hasDropdown: true
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: MessageSquare,
    badge: "8"
  },
];

const bottomItems = [
  {
    title: "Account Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    title: "Sign Out",
    url: "#",
    icon: ArrowLeft,
  },
];

export default function CustomSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>(() => {
    const initialState: { [key: string]: boolean } = {};
    items.forEach(item => {
      if (item.hasDropdown) {
        initialState[item.title] = pathname.startsWith(item.url) || 
          (item.children?.some(child => pathname === child.url) ?? false);
      }
      else {
        initialState[item.title] = pathname === item.url;
      }
    });
    return initialState;
  });

  console.log(openMenus);
  console.log("Current pathname:", pathname);
  console.log("All item pathnames:", items.map(item => ({
    main: item.url,
    children: item.children?.map(child => child.url === pathname)
  })));
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  console.log(JSON.stringify(openMenus));

  return (
    <SidebarProvider>
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <button 
        className="md:hidden  fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6 stroke-gray-700 dark:stroke-gray-300" />
      </button>
      
      <Sidebar 
        collapsible="none" 
        className={`bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 sm:w-[296px] h-screen border-r dark:border-gray-800 transition-transform duration-300 z-50 ${
          isMobile ? (
            !isMobileOpen ? 'w-0 -translate-x-full fixed' : 'translate-x-0 fixed'
          ) : ''
        }`}
        variant="floating"
      >
        <SidebarContent className="py-2">
          <SidebarGroup>
            <div className="px-6 mb-6">
              <Image src="/callspro.png" alt="ConvoiAI" width={198} height={44} />
            </div>
            <SidebarGroupContent>
              <Collapsible className="group/collapsible">
                <SidebarMenu className="gap-2 px-4">
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.hasDropdown ? (
                        <Collapsible 
                          defaultOpen={pathname.startsWith(item.url) || (item.children?.some(child => pathname === child.url) ?? false)} 
                          className="group/collapsible"
                          onOpenChange={(isOpen) => {
                            setOpenMenus(prev => ({
                              ...prev,
                              [item.title]: isOpen
                            }));
                          }}
                        >
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton 
                              className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                pathname.startsWith(item.url) || item.children?.some(child => pathname === child.url) ? "text-[#01A0A2]" : ""
                              }`}
                            >
                              <div className="flex justify-between items-center w-full">
                                <div className="flex items-center gap-3">
                                  <item.icon 
                                    className={`h-5 w-5 ${
                                      pathname.startsWith(item.url) || item.children?.some(child => pathname === child.url)
                                        ? "stroke-[#01A0A2]" 
                                        : "stroke-gray-700 dark:stroke-gray-300"
                                    }`}
                                  />
                                  <span className="font-semibold text-base">{item.title}</span>
                                </div>
                                {openMenus[item.title] ? (
                                  <ChevronDown className="h-5 w-5 stroke-gray-700 dark:stroke-gray-300" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 stroke-gray-700 dark:stroke-gray-300" />
                                )}
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children?.map((child) => (
                                <SidebarMenuSubItem className="py-1" key={child.title}>
                                  <Link 
                                    href={child.url} 
                                    className={`flex items-center gap-3 hover:text-[#01A0A2] ${
                                      pathname === child.url ? "text-[#01A0A2]" : ""
                                    }`}
                                  >
                                    <span className="font-semibold text-base">{child.title}</span>
                                  </Link>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton asChild>
                          <Link
                            href={item.url} 
                            className={`flex justify-between items-center ${pathname === item.url ? "text-[#01A0A2]" : ""}`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon 
                                className={`h-5 w-5 ${
                                  pathname === item.url 
                                    ? "stroke-[#01A0A2]" 
                                    : "stroke-gray-700 dark:stroke-gray-300"
                                }`}
                              />
                              <span className="font-semibold text-base">{item.title}</span>
                            </div>
                            {item.badge && (
                              <span color="" className="bg-red-50 text-red-700 rounded-full px-2 py-0.5 text-xs ">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-auto flex flex-col gap-2 px-4">
            <div className="flex items-center justify-end">
              <ThemeToggle />
            </div>
            {bottomItems.map((item) => (
              <SidebarMenuButton asChild key={item.title}>
                <Link href={item.url} className="flex justify-between items-center" onClick={item.title === "Sign Out" ? async () => {
                  await signOut({ callbackUrl: "/" });
                } : undefined}>
                  <div className="flex items-center gap-3">
                    <item.icon color={item.title === "Sign Out" ? "red" : "gray"} className="h-5 w-5" />
                    <span className={cn("font-semibold text-base", item.title === "Sign Out" && "text-red-500")}>{item.title}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            ))}
            
            <div className="flex items-start gap-3 border border-gray-200 dark:border-gray-800 rounded-[12px] p-3 bg-white dark:bg-gray-950">
              <div className="relative h-10 w-10 flex-shrink-0">
                <div className="h-full w-full rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  {session?.user?.name && (
                    <span className="text-sm font-medium text-[#2E7D32]">
                      {session.user.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{session?.user?.name}</span>
                <span className="text-sm text-gray-500 break-words">{session?.user?.email}</span>
              </div>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}


