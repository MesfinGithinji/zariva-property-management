"use client";

import { motion } from "framer-motion";
import {
  Building2, Users, Wrench,
  DollarSign, Bell, Plus, Clock, MapPin,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { landlordData } from "@/lib/mock-data";
import { format } from "date-fns";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-cream px-4 py-3 rounded-xl shadow-xl border border-gold-500/20">
        <p className="text-xs text-gold-400 font-medium mb-1">{label}</p>
        <p className="font-display text-lg font-semibold text-white">
          KES {(payload[0].value / 1000000).toFixed(2)}M
        </p>
      </div>
    );
  }
  return null;
};

const BarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-cream px-4 py-3 rounded-xl shadow-xl border border-gold-500/20">
        <p className="text-xs text-gold-400 font-medium mb-1">{label}</p>
        <p className="font-display text-lg font-semibold text-white">
          {payload[0].value}% occupied
        </p>
      </div>
    );
  }
  return null;
};

export default function LandlordDashboard() {
  const { overview, properties, revenueData, recentActivity, profile } = landlordData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord" pendingMaintenance={overview.pendingMaintenance} />

      <div className="ml-72 p-8">

        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
              {format(new Date(), "EEEE, MMMM d")}
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back,{" "}
              <span className="text-gold-shimmer">{profile.name.split(" ")[0]}.</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Here's what's happening with your properties today.</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative p-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-100 transition-all"
            >
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toast.success("Property form coming soon!")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
            >
              <Plus size={18} />
              Add Property
            </motion.button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            label="Total Properties"
            value={overview.totalProperties}
            icon={Building2}
            trend={{ value: 8, label: "this quarter" }}
            variant="green"
            delay={0.1}
          />
          <StatCard
            label="Monthly Revenue"
            value={overview.monthlyRevenue / 1000000}
            prefix="KES "
            suffix="M"
            decimals={2}
            icon={DollarSign}
            trend={{ value: overview.revenueGrowth, label: "vs last month" }}
            variant="gold"
            delay={0.2}
          />
          <StatCard
            label="Active Tenants"
            value={overview.activeTenants}
            icon={Users}
            trend={{ value: overview.newTenantsThisMonth, label: "new this month" }}
            variant="green"
            delay={0.3}
          />
          <StatCard
            label="Pending Maintenance"
            value={overview.pendingMaintenance}
            icon={Wrench}
            variant="neutral"
            delay={0.4}
          />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <FadeCard delay={0.5} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-gray-900">Revenue Overview</h3>
                <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
              </div>
              <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>6 months</option>
                <option>12 months</option>
                <option>This year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#1A3626" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1A3626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#1A3626" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: "#C9A843", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </FadeCard>

          <FadeCard delay={0.6} className="p-6">
            <div className="mb-6">
              <h3 className="font-display text-xl font-semibold text-gray-900">Property Performance</h3>
              <p className="text-xs text-gray-400 mt-0.5">Occupancy rate by property</p>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={properties.slice(0, 5)} margin={{ top: 5, right: 5, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="name" stroke="#d1d5db" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                <YAxis stroke="#d1d5db" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="occupancyRate" fill="#C9A843" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </FadeCard>
        </div>

        {/* Properties + Activity */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Properties */}
          <FadeCard delay={0.7} className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-semibold text-gray-900">Your Properties</h3>
              <a href="/landlord/properties" className="text-xs font-semibold text-primary-700 hover:text-gold-600 transition-colors">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {properties.slice(0, 3).map((property, index) => (
                <motion.a
                  key={property.id}
                  href={`/landlord/property/${property.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.08 }}
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gold-300/60 hover:bg-gradient-to-r hover:from-gold-50/30 hover:to-transparent transition-all cursor-pointer"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-semibold text-gray-900 mb-0.5 group-hover:text-primary-800 transition-colors">
                      {property.name}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin size={11} /> {property.location}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500">{property.occupiedUnits}/{property.units} units</span>
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full font-semibold border border-primary-100">
                        {property.occupancyRate}% occupied
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Monthly</p>
                    <p className="font-display text-lg font-semibold text-primary-800 num">
                      KES {(property.monthlyIncome / 1000).toFixed(0)}K
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </FadeCard>

          {/* Recent Activity */}
          <FadeCard delay={0.8} className="p-6">
            <h3 className="font-display text-xl font-semibold text-gray-900 mb-5">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex gap-3 group">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${
                    activity.type === "payment"      ? "bg-emerald-50 text-emerald-600" :
                    activity.type === "maintenance"  ? "bg-amber-50 text-amber-600" :
                                                       "bg-primary-50 text-primary-600"
                  }`}>
                    {activity.type === "payment"     && <DollarSign size={16} />}
                    {activity.type === "maintenance" && <Wrench size={16} />}
                    {activity.type === "lease_renewal" && <Clock size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{activity.tenant}</p>
                    <p className="text-xs text-gray-500">
                      {activity.type === "payment" && `Paid KES ${activity.amount?.toLocaleString()}`}
                      {activity.type === "maintenance" && activity.description}
                      {activity.type === "lease_renewal" && "Lease renewal pending"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{format(activity.date, "MMM d, h:mm a")}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeCard>
        </div>

      </div>
    </div>
  );
}
