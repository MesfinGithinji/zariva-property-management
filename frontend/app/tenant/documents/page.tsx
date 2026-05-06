"use client";

import { motion } from "framer-motion";
import {
  FileText, Download, Search, Filter,
  FileCheck, FileWarning, FileBadge, Receipt,
  CalendarDays, HardDrive, ExternalLink,
} from "lucide-react";
import { tenantData } from "@/lib/mock-data";
import { format } from "date-fns";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  lease:     { label: "Lease",     icon: FileCheck,   color: "text-primary-700",  bg: "bg-primary-50 border-primary-200"  },
  receipt:   { label: "Receipt",   icon: Receipt,     color: "text-emerald-700",  bg: "bg-emerald-50 border-emerald-200"  },
  notice:    { label: "Notice",    icon: FileWarning, color: "text-amber-700",    bg: "bg-amber-50 border-amber-200"      },
  inventory: { label: "Inventory", icon: FileBadge,   color: "text-blue-700",     bg: "bg-blue-50 border-blue-200"        },
};

export default function TenantDocumentsPage() {
  const { documents, currentLease, profile } = tenantData;
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filtered = documents.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || d.type === filterType;
    return matchSearch && matchType;
  });

  const counts = {
    all: documents.length,
    lease: documents.filter((d) => d.type === "lease").length,
    receipt: documents.filter((d) => d.type === "receipt").length,
    notice: documents.filter((d) => d.type === "notice").length,
    inventory: documents.filter((d) => d.type === "inventory").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar
        userType="tenant"
        currentPath="/tenant/documents"
        pendingRequests={tenantData.maintenanceRequests.filter((r) => r.status !== "completed").length}
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
              Documents
            </p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Your <span className="text-gold-shimmer">Documents</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {currentLease.property} · Unit {currentLease.unit}
            </p>
          </motion.div>
        </div>

        {/* Type filter pills */}
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          {[
            { key: "all", label: `All (${counts.all})` },
            { key: "lease", label: `Leases (${counts.lease})` },
            { key: "receipt", label: `Receipts (${counts.receipt})` },
            { key: "notice", label: `Notices (${counts.notice})` },
            { key: "inventory", label: `Inventory (${counts.inventory})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                filterType === key
                  ? "bg-primary-950 text-gold-400 border-gold-500/30 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}

          <div className="relative ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all w-52"
            />
          </div>
        </motion.div>

        {/* Lease summary card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-5 bg-gradient-to-r from-primary-950 to-primary-900 rounded-2xl text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-wide mb-1">Active Lease</p>
              <p className="font-semibold text-lg">{currentLease.property} · Unit {currentLease.unit}</p>
              <p className="text-primary-300 text-sm mt-0.5">
                {format(currentLease.leaseStart, "MMM d, yyyy")} – {format(currentLease.leaseEnd, "MMM d, yyyy")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-primary-300 text-xs mb-1">Monthly Rent</p>
              <p className="text-2xl font-bold text-gold-400 num">KES {currentLease.monthlyRent.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Document list */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No documents found</p>
            <p className="text-gray-400 text-sm">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((doc, index) => {
              const cfg = typeConfig[doc.type] || typeConfig.notice;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.06 }}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-200/60 transition-all p-5"
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border ${cfg.bg}`}>
                      <Icon size={20} className={cfg.color} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-gray-900 text-sm truncate">{doc.title}</p>
                        {(doc as any).signed && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.5 rounded border border-emerald-200 flex-shrink-0">
                            Signed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{doc.description}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {format(doc.date, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive size={11} />
                          {doc.size}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full border font-medium ${cfg.bg} ${cfg.color} text-[10px]`}>
                          {cfg.label}
                        </span>
                      </div>

                      {(doc as any).amount && (
                        <p className="text-xs font-semibold text-primary-700 num mt-1.5">
                          KES {(doc as any).amount.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={() => toast.success(`Downloading ${doc.title}…`)}
                        className="p-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl border border-gray-200 hover:border-primary-200 text-gray-500 transition-all"
                        title="Download"
                      >
                        <Download size={15} />
                      </button>
                      <button
                        onClick={() => toast.info("Document viewer coming soon!")}
                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 text-gray-500 transition-all"
                        title="View"
                      >
                        <ExternalLink size={15} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
