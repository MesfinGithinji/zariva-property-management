"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  firstName?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, firstName, action, className }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn("flex justify-between items-start mb-8", className)}
    >
      <div>
        <h1 className="font-display text-4xl font-semibold text-gray-900 mb-1 tracking-tight">
          {firstName ? (
            <>
              {title}{" "}
              <span className="text-gold-shimmer italic">{firstName}.</span>
            </>
          ) : (
            title
          )}
        </h1>
        {subtitle && (
          <p className="text-gray-500 text-sm font-body">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
