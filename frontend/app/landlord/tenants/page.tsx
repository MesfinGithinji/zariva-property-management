"use client";

import { motion } from "framer-motion";
import {
  Users, Search, Filter, Phone, Mail, Building2,
  CalendarDays, ChevronRight, AlertCircle, CheckCircle2,
  Clock, UserPlus, Download,
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { useState, useMemo, useEffect } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api, type TenantDetail, type MaintenanceStats } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { FadeCard } from "@/components/ui/fade-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<TenantDetail[]>([]);
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [listRef] = useAutoAnimate<HTMLDivElement>();

  useEffect(() => {
    Promise.all([
      api.get<TenantDetail[]>("/tenants"),
      api.get<MaintenanceStats>("/maintenance/stats"),
    ])
      .then(([t, stats]) => {
        setTenants(t);
        setMaintenanceStats(stats);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return tenants.filter((t) => {
      const matchSearch =
        t.full_name.toLowerCase().includes(search.toLowerCase()) ||
        (t.property_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (t.unit_number ?? "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || t.lease_status === filterStatus;
      const matchPayment = filterPayment === "all" || t.payment_status === filterPayment;
      return matchSearch && matchStatus && matchPayment;
    });
  }, [tenants, search, filterStatus, filterPayment]);

  const overdueCount = tenants.filter((t) => t.payment_status === "overdue").length;
  const activeCount = tenants.filter((t) => t.lease_status === "active").length;
  const endingCount = tenants.filter((t) => t.lease_status === "ending").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/tenants"
        pendingMaintenance={maintenanceStats?.pending ?? 0}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
              Tenant Management
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Your <span className="text-gold-shimmer">Tenants</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {tenants.length} tenants across your properties
            </p>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => toast.success("Export coming soon!")}
              className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl shadow-sm border border-gray-200 transition-all text-sm"
            >
              <Download size={16} />
              Export
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success("Add tenant form coming soon!")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
            >
              <UserPlus size={18} />
              Add Tenant
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Tenants" value={tenants.length} icon={Users} variant="green" delay={0.1} />
          <StatCard label="Active Leases" value={activeCount} icon={CheckCircle2} variant="green" delay={0.2} />
          <StatCard label="Leases Ending Soon" value={endingCount} icon={Clock} variant="neutral" delay={0.3} />
          <StatCard label="Overdue Payments" value={overdueCount} icon={AlertCircle} variant="neutral" delay={0.4} />
        </div>

        {/* Search & Filters */}
        <FadeCard delay={0.45} className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tenants, properties, units..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              >
                <option value="all">All Leases</option>
                <option value="active">Active</option>
                <option value="ending">Ending Soon</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </FadeCard>

        {/* Tenant List */}
        <FadeCard delay={0.5} className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {filtered.length} tenant{filtered.length !== 1 ? "s" : ""}
              {(filterStatus !== "all" || filterPayment !== "all" || search) && (
                <span className="ml-2 text-xs text-gray-400 font-normal">(filtered)</span>
              )}
            </h3>
          </div>

          <div ref={listRef} className="divide-y divide-gray-50">
            {loading ? (
              <div className="py-16 text-center">
                <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading tenants…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 font-medium">No tenants found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              filtered.map((tenant, index) => (
                <motion.div
                  key={tenant.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + index * 0.05 }}
                  className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all cursor-pointer"
                  onClick={() => toast.info(`Viewing ${tenant.full_name}'s profile — coming soon!`)}
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 bg-primary-100 flex items-center justify-center">
                    {tenant.profile_image ? (
                      <img src={tenant.profile_image} alt={tenant.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-700 font-bold text-sm">
                        {tenant.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Name & contact */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-800 transition-colors">
                      {tenant.full_name}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {tenant.phone && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone size={10} /> {tenant.phone}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Mail size={10} /> {tenant.email}
                      </span>
                    </div>
                  </div>

                  {/* Property */}
                  <div className="hidden md:block min-w-0 w-48">
                    {tenant.property_name && (
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-1 truncate">
                        <Building2 size={13} className="text-gray-400 flex-shrink-0" />
                        {tenant.property_name}
                      </p>
                    )}
                    {tenant.unit_number && (
                      <p className="text-xs text-gray-400 mt-0.5">Unit {tenant.unit_number}</p>
                    )}
                  </div>

                  {/* Lease status */}
                  <div className="hidden lg:block w-40">
                    {tenant.lease_status && (
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={tenant.lease_status as any} />
                      </div>
                    )}
                  </div>

                  {/* Rent & payment */}
                  <div className="text-right w-36 flex-shrink-0">
                    {tenant.monthly_rent != null && (
                      <p className="text-sm font-semibold text-gray-900 num">
                        KES {tenant.monthly_rent.toLocaleString()}
                        <span className="text-xs font-normal text-gray-400">/mo</span>
                      </p>
                    )}
                    {tenant.payment_status && (
                      <div className="flex justify-end mt-1">
                        <StatusBadge status={tenant.payment_status as any} />
                      </div>
                    )}
                  </div>

                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0" />
                </motion.div>
              ))
            )}
          </div>
        </FadeCard>
      </div>
    </div>
  );
}
