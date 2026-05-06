import { StatCardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function TenantsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <div className="fixed left-0 top-0 h-full w-72 bg-primary-950 animate-pulse" />
      <div className="ml-72 p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-3 w-44" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <Skeleton className="h-4 w-36" />
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => <TableRowSkeleton key={i} cols={5} />)}
        </div>
      </div>
    </div>
  );
}
