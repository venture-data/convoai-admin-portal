import CustomSidebar from "@/components/ui/customSidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import TransitionEffect from "@/components/ui/transitioneffect";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden">
        <aside className="h-full flex-shrink-0">
          <CustomSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <TransitionEffect>
            {children}
          </TransitionEffect>
        </main>
      </div>
    </ThemeProvider>
  );
}
