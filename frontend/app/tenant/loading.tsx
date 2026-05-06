import { StatCardSkeleton, CardSkeleton, TableRowSkeleton } from "@/components/ui/skeleton";

export default function TenantLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      {/* Sidebar placeholder */}
      <div className="fixed left-0 top-0 h-full w-72 bg-primary-950 animate-pulse" />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-xl" />
            <div className="h-3 w-44 bg-gray-200 animate-pulse rounded-lg" />
          </div>
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-xl" />
        </div>

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <CardSkeleton lines={5} />
          <CardSkeleton lines={4} />
          <CardSkeleton lines={6} />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-lg" />
          </div>
          {[0, 1, 2, 3, 4].map((i) => <TableRowSkeleton key={i} cols={5} />)}
        </div>
      </div>
    </div>
  );
}
