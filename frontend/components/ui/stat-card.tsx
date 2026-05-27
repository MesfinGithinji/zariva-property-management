"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  variant?: "green" | "gold" | "neutral";
  delay?: number;
  className?: string;
}

const variants = {
  green: {
    card: "bg-linear-to-br from-primary-50/70 to-white border-primary-200",
    icon: "bg-primary-100 text-primary-700",
    accent: "bg-primary-600",
    trend: "text-primary-700 bg-primary-100",
  },
  gold: {
    card: "bg-linear-to-br from-gold-50/70 to-white border-gold-200",
    icon: "bg-gold-100 text-gold-700",
    accent: "bg-gold-500",
    trend: "text-gold-700 bg-gold-100",
  },
  neutral: {
    card: "bg-white border-gray-200",
    icon: "bg-gray-100 text-gray-600",
    accent: "bg-gray-300",
    trend: "text-gray-600 bg-gray-100",
  },
};

export function StatCard({
  label,
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  icon: Icon,
  trend,
  variant = "green",
  delay = 0,
  className,
}: StatCardProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const v = variants[variant];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-all duration-300 overflow-hidden",
        v.card,
        className
      )}
    >
      {/* Left accent bar */}
      <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-r-full", v.accent)} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", v.icon)}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", v.trend)}>
            {trend.value > 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>

      <div className="num font-display text-4xl font-semibold text-gray-900 tracking-tight mb-1">
        {prefix}
        {inView ? (
          <CountUp
            end={value}
            decimals={decimals}
            separator=","
            duration={1.8}
            delay={delay}
          />
        ) : (
          "0"
        )}
        {suffix}
      </div>

      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </motion.div>
  );
}
