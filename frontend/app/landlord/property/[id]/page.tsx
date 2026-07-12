"use client";

import { motion } from "framer-motion";
import {
  Building2, MapPin, TrendingUp, DollarSign, Calendar,
  ArrowLeft, Home, Wrench, Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api, type PropertyOut, type PaymentOut, type MaintenanceOut } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { StatusBadge } from "@/components/ui/status-badge";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

interface UnitOut {
  id: number;
  property_id: number;
  unit_number: string;
  type: string;
  floor: number | null;
  rent_amount: number;
  status: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-white px-4 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm">
        <p className="text-gold-400 font-medium mb-1">{label}</p>
        <p>Collected: KES {payload[0]?.value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = Number(params.id);

  const [property, setProperty] = useState<PropertyOut | null>(null);
  const [units, setUnits] = useState<UnitOut[]>([]);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    Promise.all([
      api.get<PropertyOut>(`/properties/${propertyId}`),
      api.get<UnitOut[]>(`/units/property/${propertyId}`),
      api.get<PaymentOut[]>("/payments?limit=500"),
      api.get<MaintenanceOut[]>("/maintenance"),
    ])
      .then(([prop, us, pays, maint]) => {
        setProperty(prop);
        setUnits(us);
        setPayments(pays.filter((p) => p.property_name === prop.name));
        setMaintenance(maint.filter((m) => m.property_name === prop.name));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [propertyId]);

  // Revenue trend for this property (last 6 months, from its payments).
  const revenueHistory = (() => {
    const map: Record<string, number> = {};
    payments.forEach((p) => {
      const key = format(new Date(p.payment_date), "MMM yy");
      map[key] = (map[key] ?? 0) + p.amount;
    });
    return Object.entries(map).map(([month, collected]) => ({ month, collected })).slice(-6);
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
        <Sidebar userType="landlord" currentPath="/landlord/properties" />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-primary-700" size={28} />
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
        <Sidebar userType="landlord" currentPath="/landlord/properties" />
        <div className="lg:ml-72 p-8 pt-20 lg:pt-8">
          <a href="/landlord/properties" className="inline-flex items-center gap-2 mb-6 text-primary-700 font-semibold text-sm">
            <ArrowLeft size={16} /> Back to Properties
          </a>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center text-gray-400">
            Property not found.
          </div>
        </div>
      </div>
    );
  }

  const occupiedUnits = units.filter((u) => u.status === "occupied").length;
  const vacantUnits = units.filter((u) => u.status === "vacant").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/properties" />

      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">
        {/* Back */}
        <motion.a
          href="/landlord/properties"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -4 }}
          className="inline-flex items-center gap-2 mb-6 text-primary-700 hover:text-primary-900 font-semibold text-sm transition-all"
        >
          <ArrowLeft size={16} /> Back to Properties
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">{property.type}</p>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1">{property.name}</h1>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm">
              <MapPin size={14} className="text-primary-500" />{property.address}
            </p>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="relative h-56 md:h-80 lg:h-[420px]">
            <img
              src={property.image_url ?? "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-gold-500 text-primary-950 font-bold rounded-lg shadow-lg text-sm">
                {property.type}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Units",    value: `${property.total_units}`,                                sub: `${occupiedUnits} occupied`,          icon: Building2,  color: "bg-primary-50 text-primary-700" },
            { label: "Occupancy Rate", value: `${property.occupancy_rate}%`,                            sub: `${vacantUnits} vacant`,              icon: TrendingUp, color: "bg-gold-50 text-gold-700"      },
            { label: "Monthly Income", value: `KES ${(property.monthly_income / 1000).toFixed(0)}K`,    sub: "Expected revenue",                   icon: DollarSign, color: "bg-emerald-50 text-emerald-700" },
            { label: "Property Value", value: property.property_value ? `KES ${(property.property_value / 1000000).toFixed(1)}M` : "—", sub: property.year_built ? `Built ${property.year_built}` : "—", icon: Home, color: "bg-purple-50 text-purple-700" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-xs text-gray-400 mb-0.5">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 num">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue chart */}
        <FadeCard delay={0.5} className="p-6 mb-8">
          <h3 className="font-semibold text-xl text-gray-900 mb-5">Revenue Collection</h3>
          <div className="w-full h-48 md:h-64">
            {revenueHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="collectedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A3626" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#1A3626" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" stroke="#d1d5db" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#d1d5db" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="collected" name="Collected" stroke="#1A3626" strokeWidth={2.5} fill="url(#collectedGrad)" dot={false} activeDot={{ r: 5, fill: "#C9A843", stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">No payments recorded for this property yet</div>
            )}
          </div>
        </FadeCard>

        {/* Units Table */}
        <FadeCard delay={0.65} className="p-0 overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-xl text-gray-900">Units Overview</h3>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
              {occupiedUnits}/{property.total_units} Occupied
            </span>
          </div>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Unit", "Type", "Floor", "Rent", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {units.map((unit, idx) => (
                  <motion.tr
                    key={unit.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + idx * 0.03 }}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">{unit.unit_number}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{unit.type}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{unit.floor != null ? `F${unit.floor}` : "—"}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 num">KES {unit.rent_amount.toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={unit.status as any} />
                    </td>
                  </motion.tr>
                ))}
                {units.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400 text-sm">No units added yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {units.map((unit) => (
              <div key={unit.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-gray-900 text-sm">{unit.unit_number}</span>
                    <span className="text-xs text-gray-400">{unit.type}{unit.floor != null ? ` · F${unit.floor}` : ""}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 num">KES {unit.rent_amount.toLocaleString()}</p>
                </div>
                <StatusBadge status={unit.status as any} />
              </div>
            ))}
            {units.length === 0 && (
              <p className="px-4 py-8 text-center text-gray-400 text-sm">No units added yet</p>
            )}
          </div>
        </FadeCard>

        {/* Maintenance History (real, filtered to this property) */}
        <FadeCard delay={0.7} className="p-6 mb-8">
          <h3 className="font-semibold text-xl text-gray-900 mb-5">Maintenance History</h3>
          <div className="space-y-3">
            {maintenance.map((m) => (
              <div key={m.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gold-200/60 transition-all">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  m.priority === "high" ? "bg-red-50 text-red-600" :
                  m.priority === "medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                }`}>
                  <Wrench size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{m.issue}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Unit {m.unit_number ?? "—"}{m.tenant_name ? ` · ${m.tenant_name}` : ""}</p>
                    </div>
                    <StatusBadge status={m.status as any} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} />{format(new Date(m.submitted_date), "MMM d, yyyy")}</span>
                    {m.cost != null && (
                      <span className="flex items-center gap-1 font-semibold text-gray-600 num"><DollarSign size={11} />KES {m.cost.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {maintenance.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No maintenance requests for this property yet</p>
            )}
          </div>
        </FadeCard>
      </div>
    </div>
  );
}
