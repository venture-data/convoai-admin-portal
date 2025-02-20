"use client";

import { useState } from "react";

import { signOut } from "next-auth/react";
import { Loader } from "lucide-react";
import { Button } from "./button";

export const ResponsiveNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="flex justify-end items-center p-2 border-b min-h-10">
      <div className="hidden md:flex space-x-4">
        <Button
          onClick={async () => {
            try {
              setIsLoading(true);
              await signOut({ callbackUrl: "/" });
            } catch (e) {
              console.log(e);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className="bg-blue-600 max-h-full text-center text-white text-sm px-2 rounded hover:bg-blue-700 transition w-20 max-w-20"
        >
          {isLoading ?  <Loader className="mr-2 h-4 w-4 animate-spin" /> : "Sign Out"}
        </Button>
      </div>
      <button
        onClick={toggleMenu}
        className="md:hidden text-blue-600 text-2xl focus:outline-none"
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-100 shadow-lg rounded-md w-48 flex flex-col space-y-2 p-4 md:hidden">
          <Button
            onClick={async () => {
              await signOut({ callbackUrl: "/" });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Sign Out
          </Button>
        </div>
      )}
    </nav>
  );
};
