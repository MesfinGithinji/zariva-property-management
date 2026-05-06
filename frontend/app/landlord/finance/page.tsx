"use client";

import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownRight, Download, Filter, Building2,
  Receipt, CreditCard,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { landlordData } from "@/lib/mock-data";
import { format } from "date-fns";
import { useState } from "react";
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
            {p.name}: KES {(p.value / 1000000).toFixed(2)}M
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-white px-4 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm">
        <p className="text-gold-400 font-medium">{payload[0].name}</p>
        <p>KES {payload[0].value.toLocaleString()}</p>
        <p className="text-gray-400">{payload[0].payload.percentage}%</p>
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const { financeData, overview } = landlordData;
  const [txFilter, setTxFilter] = useState("all");

  const filteredTx = financeData.recentTransactions.filter(
    (t) => txFilter === "all" || t.type === txFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/finance"
        pendingMaintenance={overview.pendingMaintenance}
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
              Financial Overview
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              <span className="text-gold-shimmer">Financials</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Revenue, expenses, and net income — February 2026
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => toast.success("Report export coming soon!")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
          >
            <Download size={18} />
            Export Report
          </motion.button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard
            label="Total Revenue"
            value={financeData.summary.totalRevenue / 1000000}
            prefix="KES "
            suffix="M"
            decimals={2}
            icon={TrendingUp}
            trend={{ value: financeData.summary.revenueGrowth, label: "vs last month" }}
            variant="gold"
            delay={0.1}
          />
          <StatCard
            label="Total Expenses"
            value={financeData.summary.totalExpenses / 1000}
            prefix="KES "
            suffix="K"
            decimals={0}
            icon={TrendingDown}
            trend={{ value: financeData.summary.expenseGrowth, label: "vs last month" }}
            variant="neutral"
            delay={0.2}
          />
          <StatCard
            label="Net Income"
            value={financeData.summary.netIncome / 1000000}
            prefix="KES "
            suffix="M"
            decimals={2}
            icon={DollarSign}
            trend={{ value: financeData.summary.netIncomeGrowth, label: "vs last month" }}
            variant="green"
            delay={0.3}
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Collection Rate", value: `${financeData.summary.collectionRate}%`, sub: "Of expected rent collected", color: "text-emerald-600" },
            { label: "YTD Revenue", value: `KES ${(financeData.summary.ytdRevenue / 1000000).toFixed(1)}M`, sub: "Year to date", color: "text-primary-700" },
            { label: "YTD Expenses", value: `KES ${(financeData.summary.ytdExpenses / 1000000).toFixed(1)}M`, sub: "Year to date", color: "text-amber-600" },
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

        {/* P&L Chart + Expense Pie */}
        <div className="grid lg:grid-cols-5 gap-5 mb-8">
          <FadeCard delay={0.5} className="lg:col-span-3 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-xl text-gray-900">Revenue vs Expenses</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 6 months · KES</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={financeData.monthlyPnl} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A3626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1A3626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A843" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C9A843" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#1A3626" strokeWidth={2.5} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: "#1A3626", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#C9A843" strokeWidth={2} fill="url(#expGrad)" dot={false} activeDot={{ r: 4, fill: "#C9A843", stroke: "#fff", strokeWidth: 2 }} />
                <Area type="monotone" dataKey="net" name="Net Income" stroke="#10b981" strokeWidth={2} fill="url(#netGrad)" dot={false} activeDot={{ r: 4, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </FadeCard>

          <FadeCard delay={0.55} className="lg:col-span-2 p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-xl text-gray-900">Expense Breakdown</h3>
              <p className="text-xs text-gray-400 mt-0.5">By category this month</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={financeData.expenseCategories}
                  dataKey="amount"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={40}
                >
                  {financeData.expenseCategories.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-2">
              {financeData.expenseCategories.map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-600">{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-xs">{cat.percentage}%</span>
                    <span className="font-semibold text-gray-800 num text-xs">KES {(cat.amount / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeCard>
        </div>

        {/* Revenue by Property */}
        <FadeCard delay={0.6} className="p-6 mb-8">
          <div className="mb-5">
            <h3 className="font-semibold text-xl text-gray-900">Revenue by Property</h3>
            <p className="text-xs text-gray-400 mt-0.5">Collected vs target this month</p>
          </div>
          <div className="space-y-4">
            {financeData.revenueByProperty.map((prop, i) => (
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
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
              <p className="text-xs text-gray-400 mt-0.5">Income and expense entries</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={txFilter}
                onChange={(e) => setTxFilter(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredTx.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 + i * 0.04 }}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "income" ? "bg-emerald-50" : "bg-amber-50"}`}>
                  {tx.type === "income" ? (
                    <ArrowDownRight size={18} className="text-emerald-600" />
                  ) : (
                    <ArrowUpRight size={18} className="text-amber-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    {tx.type === "income" ? tx.tenant : tx.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {tx.property}{tx.type === "income" && tx.unit ? ` · Unit ${tx.unit}` : ""} · {tx.category}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
                  <Receipt size={12} />
                  {tx.reference}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-semibold num ${tx.type === "income" ? "text-emerald-600" : "text-gray-700"}`}>
                    {tx.type === "income" ? "+" : "−"}KES {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">{format(tx.date, "MMM d, yyyy")}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </FadeCard>
      </div>
    </div>
  );
}
