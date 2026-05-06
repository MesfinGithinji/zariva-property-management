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
    icon: "bg-primary-950/10 text-primary-700",
    trend: "text-primary-600",
    border: "border-primary-100",
  },
  gold: {
    icon: "bg-gold-500/10 text-gold-600",
    trend: "text-gold-600",
    border: "border-gold-100",
  },
  neutral: {
    icon: "bg-gray-100 text-gray-600",
    trend: "text-gray-500",
    border: "border-gray-100",
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
        "bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300",
        v.border,
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-xl", v.icon)}>
          <Icon size={22} />
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full bg-gray-50", v.trend)}>
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
