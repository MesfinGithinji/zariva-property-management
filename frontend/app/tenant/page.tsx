"use client";

import { motion } from "framer-motion";
import {
  CreditCard, Wrench, Bell, AlertCircle, CheckCircle2,
  Clock, Download, Send, Calendar, MapPin,
  Zap, Droplet, Wifi, Upload, X,
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";
import { useState, useEffect } from "react";
import { api, type LeaseOut, type PaymentOut, type MaintenanceOut } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { tenantData } from "@/lib/mock-data";
import Sidebar from "@/components/Sidebar";
import { toast } from "sonner";

export default function TenantDashboard() {
  const { user } = useAuth();
  const [lease, setLease] = useState<LeaseOut | null>(null);
  const [payments, setPayments] = useState<PaymentOut[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    issue: "",
    description: "",
    category: "General",
    priority: "medium",
  });

  useEffect(() => {
    Promise.all([
      api.get<LeaseOut[]>("/leases"),
      api.get<PaymentOut[]>("/payments?limit=5"),
      api.get<MaintenanceOut[]>("/maintenance"),
    ])
      .then(([leases, pays, maint]) => {
        const active = leases.find((l) => l.status === "active" || l.status === "ending");
        setLease(active ?? leases[0] ?? null);
        setPayments(pays);
        setMaintenanceRequests(maint);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Compute rent status from latest payment
  const today = new Date();
  const currentMonthStr = format(today, "MMMM yyyy");
  const paidThisMonth = payments.some(
    (p) => p.month_for === currentMonthStr && p.status === "completed",
  );
  const rentStatus = paidThisMonth ? "paid" : "overdue";
  const daysUntilLeaseEnd = lease ? differenceInDays(parseISO(lease.end_date), today) : 0;

  const activeMaintenance = maintenanceRequests.filter((r) => r.status !== "completed");

  const { utilities } = tenantData; // utilities still from mock (no backend endpoint yet)

  async function handleMaintenanceSubmit() {
    if (!form.issue.trim()) {
      toast.error("Please describe the issue.");
      return;
    }
    if (!lease) {
      toast.error("No active lease found.");
      return;
    }
    setSubmitting(true);
    try {
      const created = await api.post<MaintenanceOut>("/maintenance", {
        unit_id: lease.unit_id,
        issue: form.issue,
        description: form.description,
        category: form.category,
        priority: form.priority,
      });
      setMaintenanceRequests((prev) => [created, ...prev]);
      toast.success("Maintenance request submitted!");
      setShowMaintenanceForm(false);
      setForm({ issue: "", description: "", category: "General", priority: "medium" });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar
        userType="tenant"
        currentPath="/tenant"
        pendingRequests={activeMaintenance.length}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name?.split(" ")[0] ?? "there"}!
            </h1>
            <p className="text-gray-600">
              {lease ? `Managing your home at ${lease.property_name}` : "Loading your details…"}
            </p>
          </div>
          <button className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all">
            <Bell size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Overdue alert */}
        {!loading && rentStatus === "overdue" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-200 rounded-full">
                <AlertCircle className="text-red-700" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">Rent Payment Due</h3>
                <p className="text-red-700 mb-3">
                  Your {currentMonthStr} rent of KES {lease?.monthly_rent?.toLocaleString()} has not been recorded.
                  Please make payment via M-Pesa and contact your landlord with the reference.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rent Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-primary-900 to-primary-950 p-8 rounded-2xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="text-gold-400" size={28} />
                </div>
                {rentStatus === "paid" ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={14} /> PAID
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">OVERDUE</span>
                )}
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-2">Monthly Rent</h3>
              <p className="text-5xl font-bold text-white mb-6">
                KES {lease ? (lease.monthly_rent / 1000).toFixed(0) : "—"}K
              </p>
              <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
                <Calendar size={16} />
                <span>{currentMonthStr}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info("M-Pesa integration coming in next phase!")}
                className="w-full py-4 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-primary-950 font-bold rounded-xl shadow-xl transition-all"
              >
                Pay Rent via M-Pesa
              </motion.button>
            </div>
          </motion.div>

          {/* Maintenance Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Wrench className="text-blue-700" size={28} />
              </div>
              {activeMaintenance.length > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {activeMaintenance.length} Active
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Requests</h3>
            <p className="text-gray-600 mb-6">Submit and track maintenance requests for your unit</p>
            <div className="space-y-3 mb-6">
              {maintenanceRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    request.status === "in_progress" ? "bg-blue-500" :
                    request.status === "pending" ? "bg-yellow-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{request.issue}</p>
                    <p className="text-xs text-gray-500">{request.status.replace("_", " ")}</p>
                  </div>
                </div>
              ))}
              {maintenanceRequests.length === 0 && !loading && (
                <p className="text-sm text-gray-400 text-center py-2">No requests yet</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMaintenanceForm(true)}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit New Request
            </motion.button>
          </motion.div>
        </div>

        {/* Lease Info & Utilities */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Lease Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Lease Information</h3>
            {lease ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <MapPin className="text-gray-400" size={32} />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Property</p>
                    <p className="font-semibold text-gray-900">{lease.property_name ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Unit</p>
                    <p className="font-semibold text-gray-900">{lease.unit_number ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Lease Period</p>
                    <p className="font-semibold text-gray-900">
                      {format(parseISO(lease.start_date), "MMM dd, yyyy")} –{" "}
                      {format(parseISO(lease.end_date), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{daysUntilLeaseEnd} days remaining</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Monthly Rent</p>
                    <p className="font-semibold text-gray-900 num">KES {lease.monthly_rent.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-400">
                <MapPin size={32} className="mx-auto mb-2" />
                <p>No active lease found</p>
              </div>
            )}
          </motion.div>

          {/* Utilities (static for now) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Utilities</h3>
            <div className="space-y-4">
              {utilities.map((utility, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className={`p-2 rounded-lg ${
                    utility.type === "Water" ? "bg-blue-100" :
                    utility.type === "Electricity" ? "bg-yellow-100" : "bg-purple-100"
                  }`}>
                    {utility.type === "Water" && <Droplet className="text-blue-600" size={20} />}
                    {utility.type === "Electricity" && <Zap className="text-yellow-600" size={20} />}
                    {utility.type === "Internet" && <Wifi className="text-purple-600" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{utility.type}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">KES {utility.cost.toLocaleString()}</p>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-lg font-bold text-primary-700">
                    KES {utilities.reduce((s, u) => s + u.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <a href="/tenant/payments" className="text-primary-600 hover:text-primary-700 font-semibold text-sm">View All →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reference</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-900">{payment.month_for}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">KES {payment.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-600 capitalize">{payment.method.replace("_", " ")}</td>
                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{payment.reference}</td>
                    <td className="py-4 px-4 text-gray-600">{format(new Date(payment.payment_date), "MMM dd, yyyy")}</td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-all">
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 text-sm">No payment records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Maintenance */}
        {activeMaintenance.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Active Maintenance Requests</h3>
            <div className="space-y-4">
              {activeMaintenance.map((request) => (
                <div key={request.id} className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      request.priority === "high" ? "bg-red-100" :
                      request.priority === "medium" ? "bg-yellow-100" : "bg-blue-100"
                    }`}>
                      <Wrench className={
                        request.priority === "high" ? "text-red-600" :
                        request.priority === "medium" ? "text-yellow-600" : "text-blue-600"
                      } size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900">{request.issue}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          request.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {request.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {format(new Date(request.submitted_date), "MMM dd, yyyy")}
                        </span>
                        {request.assigned_to && (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 size={14} />
                            {request.assigned_to}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Maintenance Modal */}
      {showMaintenanceForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowMaintenanceForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Submit Maintenance Request</h3>
                <p className="text-sm text-gray-500 mt-0.5">We'll get back to you within 24 hours</p>
              </div>
              <button onClick={() => setShowMaintenanceForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.issue}
                  onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  placeholder="e.g., Leaking faucet in kitchen"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                  >
                    <option value="General">General</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High / Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the issue in detail…"
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all resize-none"
                />
              </div>
              <button
                onClick={() => toast.info("Photo attachment coming soon!")}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                <Upload size={16} />
                Attach photos (optional)
              </button>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowMaintenanceForm(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleMaintenanceSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-gold-400/40 border-t-gold-400 rounded-full animate-spin" />
                ) : (
                  <Send size={15} />
                )}
                Submit Request
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
