import { LayoutDashboard, Users, FileText, Phone, Wrench, FolderOpen, Headphones, CreditCard, BarChart } from "lucide-react";

export const navigationItems = [
  {
    header: "BUILD",
    items: [
      {
        title: "Overview",
        url: "/dashboard/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Assistants",
        url: "/dashboard/new_agents",
        icon: Users,
      },
      {
        title: "Workflows",
        url: "/dashboard/workflows",
        icon: FileText,
      },
      {
        title: "Phone Numbers",
        url: "/dashboard/phone-numbers",
        icon: Phone,
      },
      {
        title: "Tools",
        url: "/dashboard/tools",
        icon: Wrench,
      },
      {
        title: "Files",
        url: "/dashboard/files",
        icon: FolderOpen,
      },
    ],
  },
  {
    header: "TEST",
    items: [
      {
        title: "Voice Test Suites",
        url: "/dashboard/voice-test",
        icon: Headphones,
      },
    ],
  },
  {
    header: "OBSERVE",
    items: [
      {
        title: "Call Logs",
        url: "/dashboard/call-logs",
        icon: Phone,
      },
    ],
  },
  {
    header: "SETTINGS",
    items: [
      {
        title: "Billing",
        url: "/dashboard/billing",
        icon: CreditCard,
      },
      {
        title: "Usage Analytics",
        url: "/dashboard/analytics",
        icon: BarChart,
      },
    ],
  },
]; 