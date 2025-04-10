"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader, Menu } from "lucide-react";
import { Button } from "./button";
import { useMobileMenu } from "@/store/use-mobile-menu";

export const ResponsiveNavbar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toggle: toggleMobileMenu } = useMobileMenu();

  return (
    <nav className="flex justify-between items-center p-2 border-b min-h-10">
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 text-white hover:bg-white/5 rounded-lg"
        aria-label="Toggle Menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex space-x-4">
        <Button
          onClick={async () => {
            try {
              setIsLoading(true);
              await signOut({ callbackUrl: "/" });
            } catch (e) {
              console.log(e);
              setIsLoading(false);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="bg-blue-600 max-h-full text-center text-white text-sm px-2 rounded hover:bg-blue-700 transition w-20 max-w-20"
        >
          {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Sign Out"}
        </Button>
      </div>
    </nav>
  );
};
