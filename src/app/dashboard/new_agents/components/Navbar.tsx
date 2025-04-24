import { Menu } from "lucide-react";

interface NavbarProps {
    toggleMobileMenu: () => void;
}

function Navbar({toggleMobileMenu}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-xl bg-[#1A1D25]/70">
    <div className="grid grid-cols-[auto_1fr_auto] items-center px-4 py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white hover:bg-white/5 rounded-lg md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-white hidden md:block">Assistants</h1>
      </div>
      <div></div>
      {/* "Talk with Assistant" button moved to AgentConfigs component */}
    </div>
  </header>
  )
}

export default Navbar;