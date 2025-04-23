"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function TransitionEffect({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();   
  return (
    <div className="relative w-full">
      <motion.div 
        key={pathname} 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.98 }} 
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
