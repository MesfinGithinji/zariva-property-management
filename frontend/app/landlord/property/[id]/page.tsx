"use client";

import { motion } from "framer-motion";
import {
  Building2, MapPin, TrendingUp, DollarSign, Calendar,
  ArrowLeft, Home, Settings, Wrench, Shield, Zap,
  Droplet, Car, Move, Camera, Phone, Mail,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { propertyDetailData } from "@/lib/mock-data";
import { format } from "date-fns";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Sidebar from "@/components/Sidebar";
import { StatusBadge } from "@/components/ui/status-badge";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const amenityIcons: Record<string, any> = {
  shield: Shield, zap: Zap, droplet: Droplet,
  car: Car, move: Move, camera: Camera,
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-primary-950 text-white px-4 py-3 rounded-xl shadow-xl border border-gold-500/20 text-sm">
        <p className="text-gold-400 font-medium mb-1">{label}</p>
        <p>Collected: KES {payload[0]?.value?.toLocaleString()}</p>
        {payload[1] && <p className="text-gray-400">Expected: KES {payload[1]?.value?.toLocaleString()}</p>}
      </div>
    );
  }
  return null;
};

export default function PropertyDetail() {
  const property = propertyDetailData;

  // Embla carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, dragFree: false },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSelectedIndex(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/properties" />

      <div className="ml-72 p-8">
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
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-1">{property.name}</h1>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm">
              <MapPin size={14} className="text-primary-500" />{property.address}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => toast.info("Property management coming soon!")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm transition-all text-sm"
            >
              <Settings size={16} /> Manage
            </button>
            <button
              onClick={() => toast.success("Report generation coming soon!")}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
            >
              View Report
            </button>
          </div>
        </motion.div>

        {/* ── Embla Carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Main slide */}
          <div className="relative">
            <div ref={emblaRef} className="overflow-hidden">
              <div className="flex">
                {property.images.map((img, idx) => (
                  <div key={idx} className="relative flex-[0_0_100%] h-[420px]">
                    <img
                      src={img}
                      alt={`${property.name} — image ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button
              onClick={scrollPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
            >
              <ChevronRight size={20} />
            </button>

            {/* Type badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-gold-500 text-primary-950 font-bold rounded-lg shadow-lg text-sm">
                {property.type}
              </span>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollTo(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? "bg-white w-8" : "bg-white/50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                className={`relative h-20 rounded-xl overflow-hidden transition-all duration-200 ${
                  idx === selectedIndex
                    ? "ring-2 ring-primary-600 ring-offset-1 opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { label: "Total Units",    value: `${property.totalUnits}`,                          sub: `${property.occupiedUnits} occupied`,    icon: Building2,  color: "bg-primary-50 text-primary-700" },
            { label: "Occupancy Rate", value: `${property.occupancyRate}%`,                       sub: `${property.vacantUnits} vacant`,         icon: TrendingUp, color: "bg-gold-50 text-gold-700"      },
            { label: "Monthly Income", value: `KES ${(property.monthlyIncome / 1000).toFixed(0)}K`, sub: "Expected revenue",                    icon: DollarSign, color: "bg-emerald-50 text-emerald-700" },
            { label: "Property Value", value: `KES ${(property.propertyValue / 1000000).toFixed(1)}M`, sub: `Built ${property.yearBuilt}`,     icon: Home,       color: "bg-purple-50 text-purple-700"   },
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

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5 mb-8">
          <FadeCard delay={0.5} className="p-6">
            <h3 className="font-semibold text-xl text-gray-900 mb-5">Revenue Collection</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={property.revenueHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
                <Area type="monotone" dataKey="expected" name="Expected" stroke="#C9A843" strokeWidth={1.5} strokeDasharray="5 4" fill="none" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </FadeCard>

          <FadeCard delay={0.55} className="p-6">
            <h3 className="font-semibold text-xl text-gray-900 mb-5">Recent Expenses</h3>
            <div className="space-y-3">
              {property.expenses.slice(0, 5).map((expense, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{expense.description}</p>
                    <p className="text-xs text-gray-400">{expense.category} · {format(expense.date, "MMM d, yyyy")}</p>
                  </div>
                  <p className="text-sm font-bold text-red-500 num">−KES {expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </FadeCard>
        </div>

        {/* Amenities */}
        <FadeCard delay={0.6} className="p-6 mb-8">
          <h3 className="font-semibold text-xl text-gray-900 mb-5">Amenities</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {property.amenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity.icon] || Shield;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-primary-50 to-gold-50/50 rounded-xl cursor-default border border-primary-100/50"
                >
                  <div className="p-2.5 bg-white rounded-full mb-2 shadow-sm">
                    <Icon className="text-primary-600" size={20} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700 text-center leading-tight">{amenity.name}</p>
                </motion.div>
              );
            })}
          </div>
        </FadeCard>

        {/* Units Table */}
        <FadeCard delay={0.65} className="p-0 overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-xl text-gray-900">Units Overview</h3>
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full border border-primary-100">
              {property.occupiedUnits}/{property.totalUnits} Occupied
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {["Unit", "Type", "Floor", "Rent", "Tenant", "Lease Ends", "Status"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {property.units.map((unit, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + idx * 0.03 }}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-bold text-gray-900 text-sm">{unit.id}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{unit.type}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">F{unit.floor}</td>
                    <td className="py-3.5 px-4 text-sm font-semibold text-gray-900 num">KES {unit.rent.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-600">{unit.tenant ?? <span className="text-gray-300 italic">Vacant</span>}</td>
                    <td className="py-3.5 px-4 text-sm text-gray-500">{unit.leaseEnd ? format(unit.leaseEnd, "MMM d, yyyy") : "—"}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={unit.status as any} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeCard>

        {/* Maintenance History */}
        <FadeCard delay={0.7} className="p-6 mb-8">
          <h3 className="font-semibold text-xl text-gray-900 mb-5">Maintenance History</h3>
          <div className="space-y-3">
            {property.maintenanceHistory.map((m, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gold-200/60 transition-all">
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
                      <p className="text-xs text-gray-400 mt-0.5">Unit {m.unit} · {m.tenant}</p>
                    </div>
                    <StatusBadge status={m.status as any} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} />{format(m.date, "MMM d, yyyy")}</span>
                    <span className="flex items-center gap-1 font-semibold text-gray-600 num"><DollarSign size={11} />KES {m.cost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </FadeCard>

        {/* Property Manager */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-gradient-to-r from-primary-950 to-primary-900 p-6 rounded-2xl shadow-lg text-white"
        >
          <h3 className="font-semibold text-lg mb-4 text-gold-400">Property Manager</h3>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gold-500 rounded-full flex items-center justify-center text-primary-950 font-bold text-xl flex-shrink-0">
              {property.manager.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">{property.manager.name}</p>
              <div className="flex flex-wrap gap-4 mt-1 text-primary-300 text-sm">
                <span className="flex items-center gap-1.5"><Phone size={13} />{property.manager.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={13} />{property.manager.email}</span>
              </div>
            </div>
            <button
              onClick={() => toast.success("Contact form coming soon!")}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold rounded-xl transition-all text-sm"
            >
              Contact
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
