"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, AlertCircle, Clock, CheckCircle2,
  Search, Calendar, User, Building2, X,
  ChevronDown, ChevronUp, UserCheck,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api, type MaintenanceOut, type MaintenanceStats } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";

const PRIORITIES = ["All", "high", "medium", "low"];
const STATUSES = ["All", "pending", "in_progress", "completed"];

const priorityBorder: Record<string, string> = {
  high: "border-l-red-500",
  medium: "border-l-amber-400",
  low: "border-l-blue-400",
};
const priorityBadge: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceOut[]>([]);
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [listRef] = useAutoAnimate<HTMLDivElement>();
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<MaintenanceOut[]>("/maintenance"),
      api.get<MaintenanceStats>("/maintenance/stats"),
    ])
      .then(([reqs, s]) => {
        setRequests(reqs);
        setStats(s);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.issue.toLowerCase().includes(search.toLowerCase()) ||
        (r.tenant_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (r.property_name ?? "").toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === "All" || r.priority === filterPriority;
      const matchStatus = filterStatus === "All" || r.status === filterStatus;
      return matchSearch && matchPriority && matchStatus;
    });
  }, [requests, search, filterPriority, filterStatus]);

  const hasFilters = search || filterPriority !== "All" || filterStatus !== "All";

  async function updateStatus(id: number, newStatus: string) {
    try {
      const updated = await api.patch<MaintenanceOut>(`/maintenance/${id}`, { status: newStatus });
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              pending: requests.filter((r) => r.id !== id && r.status === "pending").length + (newStatus === "pending" ? 1 : 0),
              in_progress: requests.filter((r) => r.id !== id && r.status === "in_progress").length + (newStatus === "in_progress" ? 1 : 0),
              completed: requests.filter((r) => r.id !== id && r.status === "completed").length + (newStatus === "completed" ? 1 : 0),
            }
          : prev,
      );
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/maintenance"
        pendingMaintenance={stats?.pending ?? 0}
      />

      <div className="ml-72 p-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Operations</p>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            <span className="text-gold-shimmer">Maintenance</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all requests across your properties</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Pending" value={stats?.pending ?? 0} icon={Clock} variant="neutral" delay={0.1} />
          <StatCard label="In Progress" value={stats?.in_progress ?? 0} icon={Wrench} variant="gold" delay={0.15} />
          <StatCard label="Completed" value={stats?.completed ?? 0} icon={CheckCircle2} variant="green" delay={0.2} />
          <StatCard label="High Priority" value={stats?.high_priority ?? 0} icon={AlertCircle} variant="neutral" delay={0.25} />
        </div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-3"
        >
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by issue, tenant, or property…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Priority:</span>
            {PRIORITIES.map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border capitalize ${
                  filterPriority === p
                    ? "bg-primary-950 text-gold-400 border-gold-500/30"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-1" />
            <span className="text-xs text-gray-400 font-medium">Status:</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  filterStatus === s
                    ? "bg-primary-950 text-gold-400 border-gold-500/30"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                {s === "All" ? "All" : s.replace("_", " ")}
              </button>
            ))}
            {hasFilters && (
              <button
                onClick={() => { setSearch(""); setFilterPriority("All"); setFilterStatus("All"); }}
                className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </motion.div>

        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} of {requests.length} requests{hasFilters ? " (filtered)" : ""}
        </p>

        {/* List */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center bg-white rounded-2xl border border-gray-100"
            >
              <Wrench size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No requests match your filters</p>
              <button
                onClick={() => { setSearch(""); setFilterPriority("All"); setFilterStatus("All"); }}
                className="mt-2 text-sm text-primary-600 hover:text-gold-600 font-semibold transition-colors"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <div ref={listRef} className="space-y-3">
              {filtered.map((request, index) => {
                const isExpanded = expandedId === request.id;
                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl border-l-4 border border-gray-100 shadow-sm overflow-hidden ${priorityBorder[request.priority] ?? "border-l-gray-300"}`}
                  >
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : request.id)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/60 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        request.priority === "high" ? "bg-red-50" :
                        request.priority === "medium" ? "bg-amber-50" : "bg-blue-50"
                      }`}>
                        <Wrench size={18} className={
                          request.priority === "high" ? "text-red-600" :
                          request.priority === "medium" ? "text-amber-600" : "text-blue-600"
                        } />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{request.issue}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                          {request.property_name && (
                            <span className="flex items-center gap-1"><Building2 size={11} />{request.property_name} · {request.unit_number}</span>
                          )}
                          {request.tenant_name && (
                            <span className="flex items-center gap-1"><User size={11} />{request.tenant_name}</span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />{format(new Date(request.submitted_date), "MMM d")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${priorityBadge[request.priority] ?? ""}`}>
                          {request.priority}
                        </span>
                        <StatusBadge status={request.status as any} />
                        {isExpanded ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                            {request.description && (
                              <p className="text-sm text-gray-600 mb-4">{request.description}</p>
                            )}
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-500">
                                Category: <span className="font-semibold text-gray-700">{request.category}</span>
                                {request.assigned_to && (
                                  <> · Assigned to <span className="font-semibold text-gray-700">{request.assigned_to}</span></>
                                )}
                              </p>
                              <div className="flex gap-2">
                                {request.status !== "in_progress" && (
                                  <button
                                    onClick={() => updateStatus(request.id, "in_progress")}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-semibold rounded-xl transition-all border border-amber-200"
                                  >
                                    <Clock size={13} /> Mark In Progress
                                  </button>
                                )}
                                {request.status !== "completed" && (
                                  <button
                                    onClick={() => updateStatus(request.id, "completed")}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-primary-950 hover:bg-primary-900 text-gold-400 text-xs font-semibold rounded-xl transition-all border border-gold-500/20"
                                  >
                                    <UserCheck size={13} /> Mark Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
