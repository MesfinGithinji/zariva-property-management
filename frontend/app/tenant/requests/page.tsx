"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Home, Wrench, PawPrint, Plus, X, CheckCircle2, Clock, XCircle, ChevronDown, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { api, type LeaseOut, type SubletRequestOut, type AlterationRequestOut, type PetConsentOut } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "sonner";

type Tab = "sublet" | "alteration" | "pet";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock size={14} className="text-amber-500" />,
  approved: <CheckCircle2 size={14} className="text-green-500" />,
  approved_with_modifications: <CheckCircle2 size={14} className="text-blue-500" />,
  declined: <XCircle size={14} className="text-red-500" />,
};

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

  const tabs = [
    { id: "sublet" as Tab, label: "Sublet / Assign", icon: Home, count: sublets.length },
    { id: "alteration" as Tab, label: "Alterations", icon: Wrench, count: alterations.length },
    { id: "pet" as Tab, label: "Pet Consent", icon: PawPrint, count: pets.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="tenant" currentPath="/tenant/requests" />
      <div className="ml-72 p-8">
        <FadeCard delay={0}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Consent Forms</p>
              <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
              <p className="text-gray-500 text-sm mt-1">Submit and track consent requests for your tenancy</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl shadow-lg transition-all text-sm border border-gold-500/20"
            >
              <Plus size={18} /> New Request
            </button>
          </div>
        </FadeCard>

        {/* Tabs */}
        <FadeCard delay={0.1}>
          <div className="flex gap-2 mb-6 bg-white rounded-xl p-1.5 border border-gray-100 shadow-sm w-fit">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setShowForm(false); }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    tab === t.id ? "bg-primary-950 text-gold-400 shadow" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                  {t.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.id ? "bg-gold-500/20 text-gold-400" : "bg-gray-100 text-gray-500"}`}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </FadeCard>

        {/* New Request Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-gray-900">
                  {tab === "sublet" ? "New Sublet / Assignment Request" : tab === "alteration" ? "New Alteration Request" : "New Pet Consent Request"}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {tab === "sublet" && (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Subtenant Full Name *", key: "subtenant_name", type: "text" },
                    { label: "Subtenant National ID *", key: "subtenant_id_no", type: "text" },
                    { label: "Proposed Commencement *", key: "proposed_commencement", type: "date" },
                    { label: "Proposed Duration *", key: "proposed_duration", type: "text", placeholder: "e.g. 6 months" },
                    { label: "Monthly Rent to Subtenant (KES) *", key: "monthly_rent_to_subtenant", type: "number" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={(f as any).placeholder ?? ""}
                        value={(subletForm as any)[f.key]}
                        onChange={(e) => setSubletForm({ ...subletForm, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Purpose *</label>
                    <select
                      value={subletForm.purpose}
                      onChange={(e) => setSubletForm({ ...subletForm, purpose: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="full_sublet">Full Sublet</option>
                      <option value="room_only">Room Only</option>
                      <option value="full_assignment">Full Assignment</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Reason for Request *</label>
                    <textarea
                      rows={3}
                      value={subletForm.reason}
                      onChange={(e) => setSubletForm({ ...subletForm, reason: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {tab === "alteration" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description of Proposed Works *</label>
                    <textarea
                      rows={3}
                      value={altForm.description_of_works}
                      onChange={(e) => setAltForm({ ...altForm, description_of_works: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
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
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        placeholder={(f as any).placeholder ?? ""}
                        value={(altForm as any)[f.key]}
                        onChange={(e) => setAltForm({ ...altForm, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {tab === "pet" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-4 gap-2 text-xs font-semibold text-gray-500 px-1">
                    <span>Type *</span><span>Breed</span><span>Number</span><span>Vaccinated</span>
                  </div>
                  {petRows.map((pet, i) => (
                    <div key={i} className="grid grid-cols-4 gap-2 items-center">
                      <input
                        type="text" placeholder="e.g. Dog"
                        value={pet.animal_type}
                        onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, animal_type: e.target.value } : p))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="text" placeholder="e.g. Labrador"
                        value={pet.breed}
                        onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, breed: e.target.value } : p))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <input
                        type="number" min={1} max={10}
                        value={pet.number}
                        onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, number: parseInt(e.target.value) || 1 } : p))}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={pet.vaccinated}
                          onChange={(e) => setPetRows(petRows.map((p, j) => j === i ? { ...p, vaccinated: e.target.checked } : p))}
                          className="w-4 h-4 accent-primary-950"
                        />
                        <span className="text-xs text-gray-600">Yes</span>
                        {petRows.length > 1 && (
                          <button onClick={() => setPetRows(petRows.filter((_, j) => j !== i))} className="ml-auto text-red-400 hover:text-red-600">
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setPetRows([...petRows, { animal_type: "", breed: "", number: 1, vaccinated: false }])}
                    className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> Add another pet
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-semibold">Cancel</button>
                <button
                  onClick={tab === "sublet" ? submitSublet : tab === "alteration" ? submitAlteration : submitPet}
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-primary-950 text-gold-400 font-semibold rounded-xl text-sm hover:bg-primary-900 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
                  Submit Request
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Request Lists */}
        <FadeCard delay={0.2}>
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin text-primary-400" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {tab === "sublet" && (
                sublets.length === 0 ? (
                  <EmptyState label="No sublet requests yet" icon={<Home size={32} className="text-gray-300" />} />
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-3">Reference</th>
                      <th className="text-left px-5 py-3">Subtenant</th>
                      <th className="text-left px-5 py-3">Purpose</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Submitted</th>
                    </tr></thead>
                    <tbody>
                      {sublets.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-primary-700">{r.reference_number}</td>
                          <td className="px-5 py-3 font-medium text-gray-900">{r.subtenant_name}</td>
                          <td className="px-5 py-3 text-gray-600 capitalize">{r.purpose.replace("_", " ")}</td>
                          <td className="px-5 py-3"><RequestStatusBadge status={r.status} /></td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{format(parseISO(r.created_at), "dd MMM yyyy")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {tab === "alteration" && (
                alterations.length === 0 ? (
                  <EmptyState label="No alteration requests yet" icon={<Wrench size={32} className="text-gray-300" />} />
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-3">Reference</th>
                      <th className="text-left px-5 py-3">Works Description</th>
                      <th className="text-left px-5 py-3">Est. Cost</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Submitted</th>
                    </tr></thead>
                    <tbody>
                      {alterations.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-primary-700">{r.reference_number}</td>
                          <td className="px-5 py-3 text-gray-900 max-w-xs truncate">{r.description_of_works}</td>
                          <td className="px-5 py-3 text-gray-600 num">{r.estimated_cost ? `KES ${r.estimated_cost.toLocaleString()}` : "—"}</td>
                          <td className="px-5 py-3"><RequestStatusBadge status={r.status} /></td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{format(parseISO(r.created_at), "dd MMM yyyy")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}

              {tab === "pet" && (
                pets.length === 0 ? (
                  <EmptyState label="No pet consent requests yet" icon={<PawPrint size={32} className="text-gray-300" />} />
                ) : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="text-left px-5 py-3">Reference</th>
                      <th className="text-left px-5 py-3">Pets</th>
                      <th className="text-left px-5 py-3">Status</th>
                      <th className="text-left px-5 py-3">Decision By</th>
                      <th className="text-left px-5 py-3">Submitted</th>
                    </tr></thead>
                    <tbody>
                      {pets.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-primary-700">{r.reference_number}</td>
                          <td className="px-5 py-3 text-gray-900">{r.pets.map((p) => `${p.number}× ${p.animal_type}`).join(", ")}</td>
                          <td className="px-5 py-3"><RequestStatusBadge status={r.status} /></td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{r.decision_by ?? "Pending"}</td>
                          <td className="px-5 py-3 text-gray-400 text-xs">{format(parseISO(r.created_at), "dd MMM yyyy")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          )}
        </FadeCard>
      </div>
    </div>
  );
}

function RequestStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
    approved: { label: "Approved", className: "bg-green-100 text-green-700" },
    approved_with_modifications: { label: "Approved w/ Conditions", className: "bg-blue-100 text-blue-700" },
    declined: { label: "Declined", className: "bg-red-100 text-red-700" },
  };
  const cfg = map[status] ?? { label: status, className: "bg-gray-100 text-gray-600" };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
      {STATUS_ICONS[status]}
      {cfg.label}
    </span>
  );
}

function EmptyState({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon}
      <p className="text-gray-400 text-sm mt-3">{label}</p>
      <p className="text-gray-300 text-xs mt-1">Click "New Request" to get started</p>
    </div>
  );
}
