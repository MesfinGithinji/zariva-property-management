"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  hover?: boolean;
}

export function FadeCard({ children, delay = 0, className, hover = true }: FadeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
