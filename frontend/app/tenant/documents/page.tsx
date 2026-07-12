"use client";

import { motion } from "framer-motion";
import {
  FileText, Download, FileCheck, Receipt,
  CalendarDays, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { api, type LeaseOut, type PaymentOut } from "@/lib/api";
import { exportCSV } from "@/lib/csv";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function TenantDocumentsPage() {
  const [lease, setLease] = useState<LeaseOut | null>(null);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<LeaseOut[]>("/leases"),
      api.get<PaymentOut[]>("/payments?limit=200"),
    ])
      .then(([leases, pays]) => {
        setLease(leases.find((l) => l.status === "active" || l.status === "ending") ?? leases[0] ?? null);
        setPayments(pays.filter((p) => p.status === "completed"));
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  function downloadLeaseSummary() {
    if (!lease) return;
    exportCSV(
      `zariva-lease-${lease.id}.csv`,
      [lease],
      [
        { header: "Property", accessor: (l) => l.property_name ?? "" },
        { header: "Unit", accessor: (l) => l.unit_number ?? "" },
        { header: "Monthly Rent (KES)", accessor: (l) => l.monthly_rent },
        { header: "Deposit (KES)", accessor: (l) => l.deposit },
        { header: "Start Date", accessor: (l) => l.start_date },
        { header: "End Date", accessor: (l) => l.end_date },
        { header: "Status", accessor: (l) => l.status },
      ],
    );
    toast.success("Lease summary downloaded.");
  }

  function downloadReceipt(p: PaymentOut) {
    exportCSV(
      `zariva-receipt-${p.reference ?? p.id}.csv`,
      [p],
      [
        { header: "Reference", accessor: (x) => x.reference ?? String(x.id) },
        { header: "Period", accessor: (x) => x.month_for },
        { header: "Amount (KES)", accessor: (x) => x.amount },
        { header: "Method", accessor: (x) => x.method },
        { header: "Date", accessor: (x) => format(new Date(x.payment_date), "yyyy-MM-dd") },
        { header: "Property", accessor: (x) => x.property_name ?? "" },
        { header: "Unit", accessor: (x) => x.unit_number ?? "" },
      ],
    );
    toast.success("Receipt downloaded.");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
        <Sidebar userType="tenant" currentPath="/tenant/documents" />
        <div className="lg:ml-72 flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-primary-700" size={28} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar userType="tenant" currentPath="/tenant/documents" />

      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Documents</p>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Your <span className="text-gold-shimmer">Documents</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {lease ? `${lease.property_name} · Unit ${lease.unit_number}` : "Your lease and payment records"}
          </p>
        </motion.div>

        {!lease && (
          <div className="py-20 text-center">
            <FileText size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No lease documents yet</p>
            <p className="text-gray-400 text-sm">Once you join a property, your lease and receipts will appear here.</p>
          </div>
        )}

        {lease && (
          <>
            {/* Lease document */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border bg-primary-50 border-primary-200">
                  <FileCheck size={20} className="text-primary-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Lease Agreement</p>
                  <p className="text-xs text-gray-400 mb-2">{lease.property_name} · Unit {lease.unit_number}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} />
                      {format(new Date(lease.start_date), "MMM d, yyyy")} – {format(new Date(lease.end_date), "MMM d, yyyy")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full border font-medium bg-primary-50 border-primary-200 text-primary-700 text-[10px] capitalize">
                      {lease.status}
                    </span>
                    <span className="font-semibold text-primary-700 num">KES {lease.monthly_rent.toLocaleString()}/mo</span>
                  </div>
                </div>
                <button
                  onClick={downloadLeaseSummary}
                  className="p-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl border border-gray-200 hover:border-primary-200 text-gray-500 transition-all shrink-0"
                  title="Download lease summary"
                >
                  <Download size={15} />
                </button>
              </div>
            </motion.div>

            {/* Payment receipts */}
            <h2 className="text-sm font-bold text-gray-900 mb-3">Payment Receipts</h2>
            {payments.length === 0 ? (
              <p className="text-sm text-gray-400 py-6">No payment receipts yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payments.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gold-200/60 transition-all p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-200">
                        <Receipt size={20} className="text-emerald-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">Rent Receipt — {p.month_for}</p>
                        <p className="text-xs text-gray-400 mb-2 font-mono">{p.reference ?? `#${p.id}`}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <CalendarDays size={11} />
                            {format(new Date(p.payment_date), "MMM d, yyyy")}
                          </span>
                          <span className="font-semibold text-primary-700 num">KES {p.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadReceipt(p)}
                        className="p-2 bg-gray-50 hover:bg-primary-50 hover:text-primary-700 rounded-xl border border-gray-200 hover:border-primary-200 text-gray-500 transition-all shrink-0"
                        title="Download receipt"
                      >
                        <Download size={15} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
