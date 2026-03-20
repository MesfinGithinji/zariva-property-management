import { cn } from "@/lib/utils";

type Status =
  | "pending" | "in_progress" | "completed" | "cancelled"
  | "occupied" | "vacant" | "maintenance"
  | "paid" | "overdue" | "due_soon"
  | "active" | "ending" | "expired"
  | "high" | "medium" | "low";

const statusConfig: Record<Status, { label: string; className: string }> = {
  // Maintenance
  pending:     { label: "Pending",     className: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "In Progress", className: "bg-blue-50 text-blue-700 border-blue-200" },
  completed:   { label: "Completed",   className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled:   { label: "Cancelled",   className: "bg-gray-100 text-gray-500 border-gray-200" },

  // Occupancy
  occupied:    { label: "Occupied",    className: "bg-primary-50 text-primary-700 border-primary-200" },
  vacant:      { label: "Vacant",      className: "bg-gray-100 text-gray-600 border-gray-200" },
  maintenance: { label: "Maintenance", className: "bg-orange-50 text-orange-700 border-orange-200" },

  // Payment
  paid:        { label: "Paid",        className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  overdue:     { label: "Overdue",     className: "bg-red-50 text-red-700 border-red-200" },
  due_soon:    { label: "Due Soon",    className: "bg-amber-50 text-amber-700 border-amber-200" },

  // Lease
  active:      { label: "Active",      className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  ending:      { label: "Ending Soon", className: "bg-amber-50 text-amber-700 border-amber-200" },
  expired:     { label: "Expired",     className: "bg-red-50 text-red-700 border-red-200" },

  // Priority
  high:        { label: "High",        className: "bg-red-50 text-red-700 border-red-200" },
  medium:      { label: "Medium",      className: "bg-amber-50 text-amber-700 border-amber-200" },
  low:         { label: "Low",         className: "bg-gray-100 text-gray-600 border-gray-200" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, className, dot = false }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: "bg-gray-100 text-gray-600 border-gray-200" };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.className,
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full bg-current opacity-70")} />
      )}
      {config.label}
    </span>
  );
}
