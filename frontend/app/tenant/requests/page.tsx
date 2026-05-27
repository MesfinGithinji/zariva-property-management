"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wrench, PawPrint, Plus, X, CheckCircle2, Clock,
  XCircle, Loader2, ClipboardList,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { api, type LeaseOut, type SubletRequestOut, type AlterationRequestOut, type PetConsentOut } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "sublet" | "alteration" | "pet";

const STATUS_ACCENT: Record<string, string> = {
  pending: "bg-amber-400",
  approved: "bg-green-500",
  approved_with_modifications: "bg-blue-500",
  declined: "bg-red-500",
};

const STATUS_MAP: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700", icon: <Clock size={13} /> },
  approved: { label: "Approved", className: "bg-green-100 text-green-700", icon: <CheckCircle2 size={13} /> },
  approved_with_modifications: { label: "Approved w/ Conditions", className: "bg-blue-100 text-blue-700", icon: <CheckCircle2 size={13} /> },
  declined: { label: "Declined", className: "bg-red-100 text-red-700", icon: <XCircle size={13} /> },
};

const INPUT_CLS = "w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all";
const TEXTAREA_CLS = INPUT_CLS + " resize-none";

export default function TenantRequestsPage() {
  const [tab, setTab] = useState<Tab>("sublet");
  const [lease, setLease] = useState<LeaseOut | null>(null);
  const [sublets, setSublets] = useState<SubletRequestOut[]>([]);
  const [alterations, setAlterations] = useState<AlterationRequestOut[]>([]);
  const [pets, setPets] = useState<PetConsentOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Sublet form
  const [subletForm, setSubletForm] = useState({
    subtenant_name: "", subtenant_id_no: "", proposed_commencement: "",
    proposed_duration: "", monthly_rent_to_subtenant: "", purpose: "full_sublet", reason: "",
  });

  // Alteration form
  const [altForm, setAltForm] = useState({
    description_of_works: "", contractor_name: "", contractor_contact: "",
    estimated_start_date: "", estimated_duration: "", estimated_cost: "",
  });

  // Pet form
  const [petRows, setPetRows] = useState([{ animal_type: "", breed: "", number: 1, vaccinated: false }]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<LeaseOut[]>("/leases"),
      api.get<SubletRequestOut[]>("/consent/sublet/me"),
      api.get<AlterationRequestOut[]>("/consent/alterations/me"),
      api.get<PetConsentOut[]>("/consent/pets/me"),
    ]).then(([leases, subs, alts, petsData]) => {
      const active = leases.find((l) => l.status === "active" || l.status === "ending");
      setLease(active ?? leases[0] ?? null);
      setSublets(subs);
      setAlterations(alts);
      setPets(petsData);
    }).catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function submitSublet() {
    if (!lease) return toast.error("No active lease found.");
    setSubmitting(true);
    try {
      const created = await api.post<SubletRequestOut>("/consent/sublet", {
        lease_id: lease.id,
        ...subletForm,
        monthly_rent_to_subtenant: parseFloat(subletForm.monthly_rent_to_subtenant),
        proposed_commencement: new Date(subletForm.proposed_commencement).toISOString(),
      });
      setSublets((prev) => [created, ...prev]);
      setShowForm(false);
      toast.success(`Sublet request ${created.reference_number} submitted.`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitAlteration() {
    if (!lease) return toast.error("No active lease found.");
    setSubmitting(true);
    try {
      const created = await api.post<AlterationRequestOut>("/consent/alterations", {
        lease_id: lease.id,
        ...altForm,
        estimated_cost: altForm.estimated_cost ? parseFloat(altForm.estimated_cost) : undefined,
        estimated_start_date: altForm.estimated_start_date ? new Date(altForm.estimated_start_date).toISOString() : undefined,
      });
      setAlterations((prev) => [created, ...prev]);
      setShowForm(false);
      toast.success(`Alteration request ${created.reference_number} submitted.`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitPet() {
    if (!lease) return toast.error("No active lease found.");
    const validPets = petRows.filter((p) => p.animal_type.trim());
    if (!validPets.length) return toast.error("Add at least one pet.");
    setSubmitting(true);
    try {
      const created = await api.post<PetConsentOut>("/consent/pets", {
        lease_id: lease.id,
        pets: validPets,
      });
      setPets((prev) => [created, ...prev]);
      setShowForm(false);
      toast.success(`Pet consent request ${created.reference_number} submitted.`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const pendingSublets = sublets.filter((r) => r.status === "pending").length;
  const pendingAlts = alterations.filter((r) => r.status === "pending").length;
  const pendingPets = pets.filter((r) => r.status === "pending").length;

  const tabs = [
    { id: "sublet" as Tab, label: "Sublet / Assign", icon: Home, count: sublets.length },
    { id: "alteration" as Tab, label: "Alterations", icon: Wrench, count: alterations.length },
    { id: "pet" as Tab, label: "Pet Consent", icon: PawPrint, count: pets.length },
  ];

  const formTitle =
    tab === "sublet" ? "New Sublet / Assignment Request"
    : tab === "alteration" ? "New Alteration Request"
    : "New Pet Consent Request";

  function handleSubmit() {
    if (tab === "sublet") submitSublet();
    else if (tab === "alteration") submitAlteration();
    else submitPet();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar userType="tenant" currentPath="/tenant/requests" />

      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-start justify-between mb-6"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Consent Forms</p>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
              My <span className="text-gold-shimmer">Requests</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">Submit and track consent requests for your tenancy</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20 shrink-0"
          >
            <Plus size={16} /> New Request
          </motion.button>
        </motion.div>

        {/* Summary Stat Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {[
            { label: "Sublet / Assign", icon: Home, count: sublets.length, pending: pendingSublets, accent: "bg-primary-600", card: "border-primary-100", iconCls: "bg-primary-100 text-primary-700" },
            { label: "Alterations", icon: Wrench, count: alterations.length, pending: pendingAlts, accent: "bg-gold-500", card: "border-gold-100", iconCls: "bg-gold-100 text-gold-700" },
            { label: "Pet Consent", icon: PawPrint, count: pets.length, pending: pendingPets, accent: "bg-gray-400", card: "border-gray-200", iconCls: "bg-gray-100 text-gray-600" },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06 }}
                className={cn("relative bg-white rounded-2xl border shadow-sm p-5 overflow-hidden", s.card)}
              >
                <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-r-full", s.accent)} />
                <div className="flex items-center justify-between pl-3">
                  <div className={cn("p-2.5 rounded-xl", s.iconCls)}>
                    <Icon size={18} />
                  </div>
                  {s.pending > 0 && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      {s.pending} pending
                    </span>
                  )}
                </div>
                <div className="pl-3 mt-3">
                  <p className="text-3xl font-bold text-gray-900 num">{s.count}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tabs + List */}
        <FadeCard delay={0.2} className="overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold border-b-2 transition-all",
                    tab === t.id
                      ? "border-primary-950 text-primary-950"
                      : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
                  )}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{t.label}</span>
                  <span className="sm:hidden">{t.label.split(" ")[0]}</span>
                  {t.count > 0 && (
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full font-bold",
                      tab === t.id ? "bg-primary-100 text-primary-700" : "bg-gray-100 text-gray-500"
                    )}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Request List */}
          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-primary-400" />
              </div>
            ) : (
              <>
                {tab === "sublet" && (
                  sublets.length === 0
                    ? <EmptyState label="No sublet requests yet" icon={<Home size={28} />} onNew={() => setShowForm(true)} />
                    : <RequestCards items={sublets.map((r) => ({
                        id: r.id, ref: r.reference_number, status: r.status,
                        title: r.subtenant_name,
                        subtitle: r.purpose.replace(/_/g, " "),
                        meta: r.decision_by ? `Decision by ${r.decision_by}` : undefined,
                        date: r.created_at,
                      }))} />
                )}
                {tab === "alteration" && (
                  alterations.length === 0
                    ? <EmptyState label="No alteration requests yet" icon={<Wrench size={28} />} onNew={() => setShowForm(true)} />
                    : <RequestCards items={alterations.map((r) => ({
                        id: r.id, ref: r.reference_number, status: r.status,
                        title: r.description_of_works,
                        subtitle: r.estimated_cost ? `KES ${r.estimated_cost.toLocaleString()} est.` : "No cost estimate",
                        meta: r.decision_by ? `Decision by ${r.decision_by}` : undefined,
                        date: r.created_at,
                      }))} />
                )}
                {tab === "pet" && (
                  pets.length === 0
                    ? <EmptyState label="No pet consent requests yet" icon={<PawPrint size={28} />} onNew={() => setShowForm(true)} />
                    : <RequestCards items={pets.map((r) => ({
                        id: r.id, ref: r.reference_number, status: r.status,
                        title: r.pets.map((p) => `${p.number}× ${p.animal_type}`).join(", "),
                        subtitle: r.pets.map((p) => p.breed).filter(Boolean).join(", ") || "No breeds specified",
                        meta: r.decision_by ? `Decision by ${r.decision_by}` : undefined,
                        date: r.created_at,
                      }))} />
                )}
              </>
            )}
          </div>
        </FadeCard>
      </div>

      {/* Slide-over Form Drawer */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              key="form-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              key="form-drawer"
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold">New Request</p>
                  <h2 className="text-lg font-bold text-gray-900 mt-0.5">{formTitle}</h2>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

                {tab === "sublet" && (
                  <>
                    {[
                      { label: "Subtenant Full Name *", key: "subtenant_name", type: "text" },
                      { label: "Subtenant National ID *", key: "subtenant_id_no", type: "text" },
                      { label: "Proposed Commencement *", key: "proposed_commencement", type: "date" },
                      { label: "Proposed Duration *", key: "proposed_duration", type: "text", placeholder: "e.g. 6 months" },
                      { label: "Monthly Rent to Subtenant (KES) *", key: "monthly_rent_to_subtenant", type: "number" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={(f as any).placeholder ?? ""}
                          value={(subletForm as any)[f.key]}
                          onChange={(e) => setSubletForm({ ...subletForm, [f.key]: e.target.value })}
                          className={INPUT_CLS}
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Purpose *</label>
                      <select
                        value={subletForm.purpose}
                        onChange={(e) => setSubletForm({ ...subletForm, purpose: e.target.value })}
                        className={INPUT_CLS}
                      >
                        <option value="full_sublet">Full Sublet</option>
                        <option value="room_only">Room Only</option>
                        <option value="full_assignment">Full Assignment</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Reason for Request *</label>
                      <textarea
                        rows={4}
                        value={subletForm.reason}
                        onChange={(e) => setSubletForm({ ...subletForm, reason: e.target.value })}
                        className={TEXTAREA_CLS}
                      />
                    </div>
                  </>
                )}

                {tab === "alteration" && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description of Proposed Works *</label>
                      <textarea
                        rows={4}
                        value={altForm.description_of_works}
                        onChange={(e) => setAltForm({ ...altForm, description_of_works: e.target.value })}
                        className={TEXTAREA_CLS}
                      />
                    </div>
                    {[
                      { label: "Contractor Name", key: "contractor_name", type: "text" },
                      { label: "Contractor Contact", key: "contractor_contact", type: "text" },
                      { label: "Estimated Start Date", key: "estimated_start_date", type: "date" },
                      { label: "Estimated Duration", key: "estimated_duration", type: "text", placeholder: "e.g. 2 weeks" },
                      { label: "Estimated Cost (KES)", key: "estimated_cost", type: "number" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{f.label}</label>
                        <input
                          type={f.type}
                          placeholder={(f as any).placeholder ?? ""}
                          value={(altForm as any)[f.key]}
                          onChange={(e) => setAltForm({ ...altForm, [f.key]: e.target.value })}
                          className={INPUT_CLS}
                        />
                      </div>
                    ))}
                  </>
                )}

                {tab === "pet" && (
                  <div className="space-y-4">
                    <p className="text-xs text-gray-500">Add all pets you wish to keep at the property.</p>
                    {petRows.map((pet, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3 relative">
                        {petRows.length > 1 && (
                          <button
                            onClick={() => setPetRows(petRows.filter((_, j) => j !== i))}
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Animal Type *</label>
                            <input
                              type="text" placeholder="e.g. Dog"
                              value={pet.animal_type}
                              onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, animal_type: e.target.value } : p))}
                              className={INPUT_CLS}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Breed</label>
                            <input
                              type="text" placeholder="e.g. Labrador"
                              value={pet.breed}
                              onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, breed: e.target.value } : p))}
                              className={INPUT_CLS}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 items-end">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Number</label>
                            <input
                              type="number" min={1} max={10}
                              value={pet.number}
                              onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, number: parseInt(e.target.value) || 1 } : p))}
                              className={INPUT_CLS}
                            />
                          </div>
                          <label className="flex items-center gap-2.5 cursor-pointer pb-2.5">
                            <input
                              type="checkbox"
                              checked={pet.vaccinated}
                              onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, vaccinated: e.target.checked } : p))}
                              className="w-4 h-4 accent-primary-950"
                            />
                            <span className="text-sm font-medium text-gray-700">Vaccinated</span>
                          </label>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setPetRows([...petRows, { animal_type: "", breed: "", number: 1, vaccinated: false }])}
                      className="flex items-center gap-1.5 text-sm text-primary-700 font-semibold hover:text-primary-900 transition-colors"
                    >
                      <Plus size={15} /> Add another pet
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: submitting ? 1 : 1.01 }}
                  whileTap={{ scale: submitting ? 1 : 0.99 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-gold-500/20"
                >
                  {submitting && <Loader2 size={15} className="animate-spin" />}
                  Submit Request
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Request Cards ────────────────────────────────────────────────── */
interface CardItem {
  id: number;
  ref: string;
  status: string;
  title: string;
  subtitle: string;
  meta?: string;
  date: string;
}

function RequestCards({ items }: { items: CardItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const cfg = STATUS_MAP[item.status] ?? { label: item.status, className: "bg-gray-100 text-gray-600", icon: null };
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all overflow-hidden"
          >
            <div className={cn("absolute left-0 top-4 bottom-4 w-1 rounded-r-full", STATUS_ACCENT[item.status] ?? "bg-gray-300")} />
            <div className="flex items-start justify-between gap-3 pl-3">
              <div className="flex-1 min-w-0">
                <p className="font-mono text-xs text-primary-600 mb-1">{item.ref}</p>
                <p className="font-semibold text-gray-900 truncate capitalize">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{item.subtitle}</p>
              </div>
              <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0", cfg.className)}>
                {cfg.icon}
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 pl-3 text-xs text-gray-400">
              <span>Submitted {format(parseISO(item.date), "dd MMM yyyy")}</span>
              {item.meta && <span>{item.meta}</span>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Empty State ──────────────────────────────────────────────────── */
function EmptyState({ label, icon, onNew }: { label: string; icon: React.ReactNode; onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 text-gray-300">
        {icon}
      </div>
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-400 text-sm max-w-xs mb-6">
        Submit a request and your landlord will be notified to review it.
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl text-sm border border-gold-500/20 transition-all"
      >
        <ClipboardList size={15} /> New Request
      </button>
    </div>
  );
}
