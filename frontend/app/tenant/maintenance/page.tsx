"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench, Plus, Clock, CheckCircle2, AlertCircle,
  ChevronDown, ChevronUp, Upload, X, Send, User,
  CalendarDays, Tag,
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { api, type MaintenanceOut, type LeaseOut } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { StatCard } from "@/components/ui/stat-card";
import { FadeCard } from "@/components/ui/fade-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";

const priorityStyles: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusIcon: Record<string, React.ReactNode> = {
  in_progress: <Clock size={14} className="text-amber-500" />,
  pending: <AlertCircle size={14} className="text-red-500" />,
  completed: <CheckCircle2 size={14} className="text-emerald-500" />,
};

export default function TenantMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceOut[]>([]);
  const [lease, setLease] = useState<LeaseOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    issue: "",
    description: "",
    category: "General",
    priority: "medium",
  });

  useEffect(() => {
    Promise.all([
      api.get<MaintenanceOut[]>("/maintenance"),
      api.get<LeaseOut[]>("/leases"),
    ])
      .then(([reqs, leases]) => {
        setRequests(reqs);
        const active = leases.find((l) => l.status === "active" || l.status === "ending");
        setLease(active ?? leases[0] ?? null);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const completedCount = requests.filter((r) => r.status === "completed").length;

  async function handleSubmit() {
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
      setRequests((prev) => [created, ...prev]);
      toast.success("Maintenance request submitted! We'll get back to you shortly.");
      setShowForm(false);
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
        currentPath="/tenant/maintenance"
        pendingRequests={pendingCount + inProgressCount}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Maintenance</p>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Your <span className="text-gold-shimmer">Requests</span>
            </h1>
            {lease && (
              <p className="text-gray-500 text-sm mt-1">
                {lease.property_name} · Unit {lease.unit_number}
              </p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
          >
            <Plus size={18} />
            New Request
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <StatCard label="Pending" value={pendingCount} icon={AlertCircle} variant="neutral" delay={0.1} />
          <StatCard label="In Progress" value={inProgressCount} icon={Clock} variant="gold" delay={0.2} />
          <StatCard label="Completed" value={completedCount} icon={CheckCircle2} variant="green" delay={0.3} />
        </div>

        {/* Request List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <FadeCard delay={0.4} className="py-16 text-center">
            <Wrench size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No maintenance requests yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 text-sm text-primary-600 hover:text-gold-600 font-semibold"
            >
              Submit your first request
            </button>
          </FadeCard>
        ) : (
          <div className="space-y-4">
            {requests.map((req, index) => {
              const isExpanded = expandedId === req.id;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : req.id)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/60 transition-colors"
                  >
                    <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${
                      req.priority === "high" ? "bg-red-500" :
                      req.priority === "medium" ? "bg-amber-400" : "bg-blue-400"
                    }`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {statusIcon[req.status]}
                        <p className="font-semibold text-gray-900">{req.issue}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Tag size={11} />{req.category}</span>
                        <span className="flex items-center gap-1">
                          <CalendarDays size={11} />
                          {format(new Date(req.submitted_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${priorityStyles[req.priority] ?? ""}`}>
                        {req.priority}
                      </span>
                      <StatusBadge status={req.status as any} />
                      {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 border-t border-gray-100">
                          <div className="pt-4 grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Description</p>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {req.description ?? "No description provided."}
                              </p>
                            </div>
                            <div className="space-y-3">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status Details</p>
                              <div className="space-y-2 text-sm">
                                {req.assigned_to && (
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <User size={13} className="text-gray-400" />
                                    Assigned to: <span className="font-medium">{req.assigned_to}</span>
                                  </div>
                                )}
                                {req.estimated_completion && (
                                  <div className="flex items-center gap-2 text-gray-700">
                                    <CalendarDays size={13} className="text-gray-400" />
                                    Est. completion:{" "}
                                    <span className="font-medium">
                                      {format(new Date(req.estimated_completion), "MMM d, yyyy")}
                                    </span>
                                  </div>
                                )}
                                {req.completed_date && (
                                  <div className="flex items-center gap-2 text-emerald-600">
                                    <CheckCircle2 size={13} />
                                    Completed: <span className="font-medium">{format(new Date(req.completed_date), "MMM d, yyyy")}</span>
                                  </div>
                                )}
                                {!req.assigned_to && req.status === "pending" && (
                                  <p className="text-gray-400 italic text-xs">Awaiting assignment</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* New Request Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">New Maintenance Request</h3>
                    {lease && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {lease.property_name} · Unit {lease.unit_number}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
                    <X size={18} />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Issue Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Broken door handle in bedroom"
                      value={form.issue}
                      onChange={(e) => setForm({ ...form, issue: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                      >
                        <option value="General">General</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="HVAC">HVAC</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Security">Security</option>
                        <option value="Structural">Structural</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Priority</label>
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
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
                      placeholder="Describe the issue in detail..."
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all resize-none"
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
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm disabled:opacity-60"
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
        </AnimatePresence>
      </div>
    </div>
  );
}
