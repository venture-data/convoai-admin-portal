import { toast } from "@/app/hooks/use-toast";
import { Menu } from "lucide-react";

interface NavbarProps {
    toggleMobileMenu: () => void;
    selectedAgentId: string | null;
    setIsCallModalOpen: (open: boolean) => void;
}

function Navbar({toggleMobileMenu, selectedAgentId, setIsCallModalOpen}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-[#1A1D25]/70">
    <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-2">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white hover:bg-white/5 rounded-lg md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-white hidden md:block">Assistants</h1>
      </div>
      <div></div>
      <button className="py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-md hover:bg-orange-600 transition-colors grid grid-flow-col items-center gap-2"
        onClick={() => selectedAgentId ? setIsCallModalOpen(true) : toast({
          title: "No agent selected",
          description: "Please select an agent first to start a call",
          variant: "destructive"
        })}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 12H16M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Talk with Assistant
      </button>
    </div>
  </header>
  )
}

export default Navbar;