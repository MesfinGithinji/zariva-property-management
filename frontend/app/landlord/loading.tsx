import { StatCardSkeleton, ChartSkeleton, CardSkeleton } from "@/components/ui/skeleton";

export default function LandlordLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      {/* Sidebar placeholder */}
      <div className="fixed left-0 top-0 h-full w-72 bg-primary-950 animate-pulse" />

      <div className="ml-72 p-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-gray-200 animate-pulse rounded-lg" />
            <div className="h-10 w-72 bg-gray-200 animate-pulse rounded-xl" />
            <div className="h-3 w-52 bg-gray-200 animate-pulse rounded-lg" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-xl" />
            <div className="h-10 w-36 bg-gray-200 animate-pulse rounded-xl" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-lg mb-6" />
            <ChartSkeleton height={260} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded-lg mb-6" />
            <ChartSkeleton height={260} />
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <CardSkeleton lines={4} />
          </div>
          <CardSkeleton lines={5} />
        </div>
      </div>
    </div>
  );
}
