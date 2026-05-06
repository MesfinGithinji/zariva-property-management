"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Building2, MapPin, TrendingUp, Search, Plus, Eye, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { api, type PropertyOut, type MaintenanceStats } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { toast } from "sonner";

const TYPES = ["All", "Apartment", "Commercial", "Villa", "Mixed Use"];
const STATUSES = ["All", "active", "maintenance"];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyOut[]>([]);
  const [maintenanceStats, setMaintenanceStats] = useState<MaintenanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    Promise.all([
      api.get<PropertyOut[]>("/properties"),
      api.get<MaintenanceStats>("/maintenance/stats"),
    ])
      .then(([props, stats]) => {
        setProperties(props);
        setMaintenanceStats(stats);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchType = activeType === "All" || p.type === activeType;
      const matchStatus = activeStatus === "All" || p.status === activeStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [properties, search, activeType, activeStatus]);

  const totalUnits = properties.reduce((s, p) => s + p.total_units, 0);
  const occupiedUnits = properties.reduce((s, p) => s + p.occupied_units, 0);
  const avgOccupancy =
    properties.length > 0
      ? properties.reduce((s, p) => s + p.occupancy_rate, 0) / properties.length
      : 0;
  const totalRevenue = properties.reduce((s, p) => s + p.monthly_income, 0);
  const hasFilters = search || activeType !== "All" || activeStatus !== "All";

  function clearFilters() {
    setSearch("");
    setActiveType("All");
    setActiveStatus("All");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/properties"
        pendingMaintenance={maintenanceStats?.pending ?? 0}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Portfolio</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              My <span className="text-gold-shimmer">Properties</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Manage and monitor all your properties</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast.success("Add property form coming soon!")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
          >
            <Plus size={18} />
            Add Property
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Properties" value={properties.length} icon={Building2} trend={{ value: 2, label: "this quarter" }} variant="green" delay={0.1} />
          <StatCard label="Total Units" value={totalUnits} icon={Building2} trend={{ value: occupiedUnits, label: "occupied" }} variant="green" delay={0.15} />
          <StatCard label="Avg Occupancy" value={avgOccupancy} suffix="%" decimals={1} icon={TrendingUp} variant="gold" delay={0.2} />
          <StatCard label="Monthly Revenue" value={totalRevenue / 1000000} prefix="KES " suffix="M" decimals={2} icon={TrendingUp} variant="gold" delay={0.25} />
        </div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 space-y-3"
        >
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 shadow-sm">
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filter</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    activeType === t
                      ? "bg-primary-950 text-gold-400 border-gold-500/30"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <div className="flex items-center gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border capitalize ${
                    activeStatus === s
                      ? "bg-primary-950 text-gold-400 border-gold-500/30"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s === "All" ? "All Status" : s}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-xs text-gray-400 mb-4"
        >
          {filtered.length} of {properties.length} properties{hasFilters && " (filtered)"}
        </motion.p>

        {/* Properties Grid */}
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div key="loading" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100" />
              ))}
            </motion.div>
          ) : filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center"
            >
              <Building2 size={44} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No properties match your filters</p>
              <button onClick={clearFilters} className="mt-2 text-sm text-primary-600 hover:text-gold-600 font-semibold transition-colors">
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div key="grid" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property, index) => (
                <motion.a
                  key={property.id}
                  href={`/landlord/property/${property.id}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.07, duration: 0.3 }}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden cursor-pointer border border-gray-100 hover:border-gold-200/60"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.image_url ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400"}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        property.status === "active" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
                      }`}>
                        {property.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 bg-black/30 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                        {property.type}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="p-2 bg-white rounded-full shadow">
                        <Eye className="text-primary-700" size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-800 transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4">
                      <MapPin size={13} /> {property.location}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Units</p>
                        <p className="font-bold text-gray-900">{property.occupied_units}/{property.total_units}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Occupancy</p>
                        <p className={`font-bold ${
                          property.occupancy_rate >= 90 ? "text-emerald-600" :
                          property.occupancy_rate >= 75 ? "text-amber-600" : "text-red-500"
                        }`}>
                          {property.occupancy_rate}%
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">Monthly Income</span>
                      <span className="font-bold text-primary-800 num flex items-center gap-1">
                        <TrendingUp size={13} className="text-gold-500" />
                        KES {(property.monthly_income / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
