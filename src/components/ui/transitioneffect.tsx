"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function TransitionEffect({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();   
  return <motion.div key={pathname} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.5 }}>{children}</motion.div>;
}
