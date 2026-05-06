import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "skeleton-shimmer 1.6s ease-in-out infinite",
      }}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      {Array.from({ length: cols - 1 }).map((_, i) => (
        <Skeleton key={i} className="h-3.5 w-20 flex-shrink-0" />
      ))}
    </div>
  );
}

export function ChartSkeleton({ height = 260 }: { height?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2" style={{ height }}>
        {[40, 65, 55, 80, 70, 90].map((h, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-lg"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {[40, 65, 55, 80, 70, 90].map((_, i) => (
          <Skeleton key={i} className="flex-1 h-3 rounded" />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <Skeleton className="h-4 w-36" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`h-3 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
