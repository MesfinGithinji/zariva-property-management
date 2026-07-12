"use client";

import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, ArrowDownRight, Download, Receipt, Loader2,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { api, type PropertyOut, type PaymentOut, type MaintenanceStats } from "@/lib/api";
import { exportCSV } from "@/lib/csv";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-white px-4 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm">
        <p className="text-gold-400 font-medium mb-2">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="mb-0.5">
            {p.name}: KES {(p.value / 1000).toFixed(0)}K
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const [properties, setProperties] = useState<PropertyOut[]>([]);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<PropertyOut[]>("/properties"),
      api.get<PaymentOut[]>("/payments?limit=500"),
      api.get<MaintenanceStats>("/maintenance/stats"),
    ])
      .then(([props, pays, stats]) => {
        setProperties(props);
        setPayments(pays);
        setMaintenanceStats(stats);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  const thisMonthStr = format(today, "MMMM yyyy");

  // Real revenue metrics from live payments.
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const monthlyRevenue = payments
    .filter((p) => p.month_for === thisMonthStr)
    .reduce((s, p) => s + p.amount, 0);
  const expectedMonthly = properties.reduce((s, p) => s + p.monthly_income, 0);
  const collectionRate = expectedMonthly > 0 ? Math.min(100, Math.round((monthlyRevenue / expectedMonthly) * 100)) : 0;

  // Revenue trend (last 6 months) from payment dates.
  const revenueTrend = useMemo(() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => {
      const key = format(new Date(p.payment_date), "MMM yy");
      map[key] = (map[key] ?? 0) + p.amount;
    });
    return Object.entries(map).map(([month, revenue]) => ({ month, revenue })).slice(-6);
  }, [payments]);

  // Revenue by property this month.
  const revenueByProperty = useMemo(() => {
    return properties.map((prop) => {
      const collected = payments
        .filter((p) => p.property_name === prop.name && p.month_for === thisMonthStr)
        .reduce((s, p) => s + p.amount, 0);
      const target = prop.monthly_income || 0;
      const rate = target > 0 ? Math.min(100, Math.round((collected / target) * 100)) : 0;
      return { property: prop.name, revenue: collected, target, rate };
    });
  }, [properties, payments, thisMonthStr]);

  function handleExport() {
    if (payments.length === 0) {
      toast.info("No transactions to export yet.");
      return;
    }
    exportCSV(
      `zariva-finance-${format(today, "yyyy-MM-dd")}.csv`,
      payments,
      [
        { header: "Tenant", accessor: (p) => p.tenant_name ?? "" },
        { header: "Property", accessor: (p) => p.property_name ?? "" },
        { header: "Unit", accessor: (p) => p.unit_number ?? "" },
        { header: "Period", accessor: (p) => p.month_for },
        { header: "Amount (KES)", accessor: (p) => p.amount },
        { header: "Method", accessor: (p) => p.method },
        { header: "Reference", accessor: (p) => p.reference ?? "" },
        { header: "Date", accessor: (p) => format(new Date(p.payment_date), "yyyy-MM-dd") },
      ],
    );
    toast.success("Finance report exported.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
        <Sidebar userType="landlord" currentPath="/landlord/finance" />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-primary-700" size={28} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/finance"
        pendingMaintenance={maintenanceStats?.pending ?? 0}
      />

      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
              Financial Overview
            </p>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
              <span className="text-gold-shimmer">Financials</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Rent collection and revenue — {thisMonthStr}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
          >
            <Download size={18} />
            Export Report
          </motion.button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Collected This Month"
            value={monthlyRevenue / 1000}
            prefix="KES "
            suffix="K"
            decimals={0}
            icon={TrendingUp}
            variant="gold"
            delay={0.1}
          />
          <StatCard
            label="Expected This Month"
            value={expectedMonthly / 1000}
            prefix="KES "
            suffix="K"
            decimals={0}
            icon={DollarSign}
            variant="green"
            delay={0.2}
          />
          <StatCard
            label="Total Collected (all time)"
            value={totalRevenue / 1000000}
            prefix="KES "
            suffix="M"
            decimals={2}
            icon={ArrowDownRight}
            variant="neutral"
            delay={0.3}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Collection Rate", value: `${collectionRate}%`, sub: `Of expected rent for ${thisMonthStr}`, color: "text-emerald-600" },
            { label: "Properties", value: `${properties.length}`, sub: "In your portfolio", color: "text-primary-700" },
            { label: "Payments Recorded", value: `${payments.length}`, sub: "All time", color: "text-amber-600" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{item.label}</p>
              <p className={`text-2xl font-bold num ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400 mt-1">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue trend */}
        <FadeCard delay={0.5} className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-xl text-gray-900">Revenue Collected</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months · KES</p>
            </div>
          </div>
          <div className="w-full h-48 md:h-64">
            {revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3626" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1A3626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1A3626" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#C9A843", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No payments recorded yet</div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-4 border-t border-gray-50 pt-3">
            Expense tracking & full profit-and-loss reporting are coming in a future update. This view currently reflects rent collected.
          </p>
        </FadeCard>

        {/* Revenue by Property */}
        <FadeCard delay={0.6} className="p-6 mb-8">
          <div className="mb-5">
            <h3 className="font-semibold text-xl text-gray-900">Revenue by Property</h3>
            <p className="text-xs text-gray-400 mt-0.5">Collected vs target this month</p>
          </div>
          <div className="space-y-4">
            {revenueByProperty.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No properties yet</p>
            )}
            {revenueByProperty.map((prop, i) => (
              <motion.div
                key={prop.property}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-36 flex-shrink-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{prop.property}</p>
                  <p className="text-xs text-gray-400">
                    KES {(prop.revenue / 1000).toFixed(0)}K / {(prop.target / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${prop.rate}%` }}
                    transition={{ delay: 0.7 + i * 0.05, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: prop.rate >= 95 ? "#1A3626" : prop.rate >= 80 ? "#C9A843" : "#f59e0b" }}
                  />
                </div>
                <span className={`text-sm font-semibold num w-12 text-right ${prop.rate >= 95 ? "text-emerald-600" : prop.rate >= 80 ? "text-amber-600" : "text-red-500"}`}>
                  {prop.rate}%
                </span>
              </motion.div>
            ))}
          </div>
        </FadeCard>

        {/* Transactions */}
        <FadeCard delay={0.7} className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Recent Payments</h3>
            <p className="text-xs text-gray-400 mt-0.5">Rent received from tenants</p>
          </div>

          <div className="divide-y divide-gray-50">
            {payments.slice(0, 12).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 + i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-emerald-50">
                  <ArrowDownRight size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.tenant_name ?? "—"}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {p.property_name ?? "—"}{p.unit_number ? ` · Unit ${p.unit_number}` : ""} · {p.month_for}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                  <Receipt size={12} />
                  {p.reference ?? "—"}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold num text-emerald-600">
                    +KES {p.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{format(new Date(p.payment_date), "MMM d, yyyy")}</p>
                </div>
              </motion.div>
            ))}
            {payments.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No payments recorded yet</p>
            )}
          </div>
        </FadeCard>
      </div>
    </div>
  );
}
