"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Home, Wrench, PawPrint, ShieldCheck, CheckCircle2, XCircle, Clock, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { api, type SubletRequestOut, type AlterationRequestOut, type PetConsentOut, type DataSubjectRequestOut } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

type Tab = "sublet" | "alteration" | "pet" | "dsr";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  approved_with_modifications: "bg-blue-100 text-blue-700",
  declined: "bg-red-100 text-red-700",
  resolved: "bg-gray-100 text-gray-600",
};

function StatusPill({ status }: { status: string }) {
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

function DecisionPanel({ onDecide, loading, hasModifications = false, hasDeposit = false }: {
  onDecide: (data: any) => void;
  loading: boolean;
  hasModifications?: boolean;
  hasDeposit?: boolean;
}) {
  const [status, setStatus] = useState("approved");
  const [conditions, setConditions] = useState("");
  const [declineReason, setDeclineReason] = useState("");
  const [deposit, setDeposit] = useState("");

  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
      <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Record Decision</p>
      <div className="flex gap-2 flex-wrap">
        {["approved", hasModifications ? "approved_with_modifications" : null, "declined"].filter(Boolean).map((s) => (
          <button
            key={s!}
            onClick={() => setStatus(s!)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              status === s
                ? s === "declined" ? "bg-red-600 text-white border-red-600" : "bg-primary-950 text-gold-400 border-primary-950"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {s!.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>
      {status === "approved_with_modifications" && (
        <textarea
          rows={2}
          placeholder="State the modification conditions…"
          value={conditions}
          onChange={(e) => setConditions(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      )}
      {status === "declined" && (
        <textarea
          rows={2}
          placeholder="Reason for declining…"
          value={declineReason}
          onChange={(e) => setDeclineReason(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      )}
      {hasDeposit && status === "approved" && (
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Pet Deposit (KES)</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      )}
      <button
        onClick={() => onDecide({ status, additional_conditions: conditions || undefined, modification_conditions: conditions || undefined, decline_reason: declineReason || undefined, additional_deposit: deposit ? parseFloat(deposit) : undefined })}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-primary-950 text-gold-400 text-xs font-bold rounded-lg hover:bg-primary-900 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
        Submit Decision
      </button>
    </div>
  );
}

export default function LandlordRequestsPage() {
  const [tab, setTab] = useState<Tab>("sublet");
  const [sublets, setSublets] = useState<SubletRequestOut[]>([]);
  const [alterations, setAlterations] = useState<AlterationRequestOut[]>([]);
  const [pets, setPets] = useState<PetConsentOut[]>([]);
  const [dsrs, setDsrs] = useState<DataSubjectRequestOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [deciding, setDeciding] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

  const pendingCount = (arr: any[]) => arr.filter((r) => r.status === "pending").length;

  useEffect(() => {
    Promise.all([
      api.get<SubletRequestOut[]>("/consent/sublet"),
      api.get<AlterationRequestOut[]>("/consent/alterations"),
      api.get<PetConsentOut[]>("/consent/pets"),
      api.get<DataSubjectRequestOut[]>("/consent/data-subject-requests"),
    ]).then(([subs, alts, petsData, dsrData]) => {
      setSublets(subs);
      setAlterations(alts);
      setPets(petsData);
      setDsrs(dsrData);
    }).catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function decideSublet(id: number, data: any) {
    setDeciding(id);
    try {
      const updated = await api.patch<SubletRequestOut>(`/consent/sublet/${id}`, data);
      setSublets((prev) => prev.map((r) => r.id === id ? updated : r));
      toast.success("Decision recorded.");
    } catch (err: any) { toast.error(err.message); }
    finally { setDeciding(null); }
  }

  async function decideAlteration(id: number, data: any) {
    setDeciding(id);
    try {
      const updated = await api.patch<AlterationRequestOut>(`/consent/alterations/${id}`, data);
      setAlterations((prev) => prev.map((r) => r.id === id ? updated : r));
      toast.success("Decision recorded.");
    } catch (err: any) { toast.error(err.message); }
    finally { setDeciding(null); }
  }

  async function decidePet(id: number, data: any) {
    setDeciding(id);
    try {
      const updated = await api.patch<PetConsentOut>(`/consent/pets/${id}`, data);
      setPets((prev) => prev.map((r) => r.id === id ? updated : r));
      toast.success("Decision recorded.");
    } catch (err: any) { toast.error(err.message); }
    finally { setDeciding(null); }
  }

  async function resolveDsr(id: number, response: string) {
    setDeciding(id);
    try {
      const updated = await api.patch<DataSubjectRequestOut>(`/consent/data-subject-requests/${id}`, { status: "resolved", response });
      setDsrs((prev) => prev.map((r) => r.id === id ? updated : r));
      toast.success("Request resolved.");
    } catch (err: any) { toast.error(err.message); }
    finally { setDeciding(null); }
  }

  const tabs = [
    { id: "sublet" as Tab, label: "Sublet Requests", icon: Home, pending: pendingCount(sublets) },
    { id: "alteration" as Tab, label: "Alterations", icon: Wrench, pending: pendingCount(alterations) },
    { id: "pet" as Tab, label: "Pet Consents", icon: PawPrint, pending: pendingCount(pets) },
    { id: "dsr" as Tab, label: "Data Rights", icon: ShieldCheck, pending: pendingCount(dsrs) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/requests" pendingRequests={tabs.reduce((s, t) => s + t.pending, 0)} />
      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">
        <FadeCard delay={0}>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">Consent Management</p>
            <h1 className="text-3xl font-bold text-gray-900">Consent Requests</h1>
            <p className="text-gray-500 text-sm mt-1">Review and action tenant consent requests under the Kenya DPA 2019</p>
          </div>
        </FadeCard>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <FadeCard key={t.id} delay={0.05}>
                <button
                  onClick={() => setTab(t.id)}
                  className={`w-full bg-white rounded-xl border shadow-sm p-4 text-left transition-all hover:shadow-md ${tab === t.id ? "border-gold-400 ring-1 ring-gold-400" : "border-gray-100"}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${tab === t.id ? "bg-primary-950" : "bg-gray-100"}`}>
                      <Icon size={16} className={tab === t.id ? "text-gold-400" : "text-gray-500"} />
                    </div>
                    {t.pending > 0 && <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 font-bold rounded-full">{t.pending} pending</span>}
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{t.label}</p>
                </button>
              </FadeCard>
            );
          })}
        </div>

        <FadeCard delay={0.2}>
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-primary-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {tab === "sublet" && sublets.map((r) => (
                <RequestCard
                  key={r.id}
                  refNo={r.reference_number}
                  tenantName={r.tenant_name ?? "—"}
                  status={r.status}
                  date={r.created_at}
                  expanded={expanded === r.id}
                  onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <div className="grid grid-cols-3 gap-3 text-xs mb-4">
                    <Detail label="Subtenant" value={r.subtenant_name} />
                    <Detail label="Subtenant ID" value={r.subtenant_id_no} />
                    <Detail label="Purpose" value={r.purpose.replace("_", " ")} />
                    <Detail label="Proposed Start" value={format(parseISO(r.proposed_commencement), "dd MMM yyyy")} />
                    <Detail label="Duration" value={r.proposed_duration} />
                    <Detail label="Monthly Rent" value={`KES ${Number(r.monthly_rent_to_subtenant).toLocaleString()}`} />
                  </div>
                  <Detail label="Reason" value={r.reason} full />
                  {r.status === "pending" && (
                    <div className="mt-4">
                      <DecisionPanel onDecide={(d) => decideSublet(r.id, d)} loading={deciding === r.id} />
                    </div>
                  )}
                  {r.status !== "pending" && r.decision_by && (
                    <p className="text-xs text-gray-400 mt-3">Decision by {r.decision_by} on {r.decision_date ? format(parseISO(r.decision_date), "dd MMM yyyy") : "—"}</p>
                  )}
                </RequestCard>
              ))}

              {tab === "alteration" && alterations.map((r) => (
                <RequestCard
                  key={r.id}
                  refNo={r.reference_number}
                  tenantName={r.tenant_name ?? "—"}
                  status={r.status}
                  date={r.created_at}
                  expanded={expanded === r.id}
                  onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <Detail label="Description of Works" value={r.description_of_works} full />
                  <div className="grid grid-cols-3 gap-3 text-xs mt-3 mb-4">
                    <Detail label="Contractor" value={r.contractor_name ?? "—"} />
                    <Detail label="Contact" value={r.contractor_contact ?? "—"} />
                    <Detail label="Est. Cost" value={r.estimated_cost ? `KES ${Number(r.estimated_cost).toLocaleString()}` : "—"} />
                    <Detail label="Est. Start" value={r.estimated_start_date ? format(parseISO(r.estimated_start_date), "dd MMM yyyy") : "—"} />
                    <Detail label="Duration" value={r.estimated_duration ?? "—"} />
                  </div>
                  {r.status === "pending" && (
                    <DecisionPanel onDecide={(d) => decideAlteration(r.id, d)} loading={deciding === r.id} hasModifications />
                  )}
                </RequestCard>
              ))}

              {tab === "pet" && pets.map((r) => (
                <RequestCard
                  key={r.id}
                  refNo={r.reference_number}
                  tenantName={r.tenant_name ?? "—"}
                  status={r.status}
                  date={r.created_at}
                  expanded={expanded === r.id}
                  onToggle={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Pets</p>
                    <div className="flex flex-wrap gap-2">
                      {r.pets.map((p, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          <PawPrint size={11} />
                          {p.number}× {p.animal_type} {p.breed ? `(${p.breed})` : ""} — {p.vaccinated ? "Vaccinated" : "Not vaccinated"}
                        </span>
                      ))}
                    </div>
                  </div>
                  {r.status === "pending" && (
                    <DecisionPanel onDecide={(d) => decidePet(r.id, d)} loading={deciding === r.id} hasDeposit />
                  )}
                  {r.additional_deposit && <p className="text-xs text-gray-500 mt-2">Additional deposit: KES {Number(r.additional_deposit).toLocaleString()}</p>}
                </RequestCard>
              ))}

              {tab === "dsr" && dsrs.map((r) => (
                <DsrCard key={r.id} dsr={r} onResolve={resolveDsr} deciding={deciding === r.id} expanded={expanded === r.id} onToggle={() => setExpanded(expanded === r.id ? null : r.id)} />
              ))}

              {((tab === "sublet" && !sublets.length) || (tab === "alteration" && !alterations.length) || (tab === "pet" && !pets.length) || (tab === "dsr" && !dsrs.length)) && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                  <ClipboardList size={36} className="mx-auto text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm">No requests in this category</p>
                </div>
              )}
            </div>
          )}
        </FadeCard>
      </div>
    </div>
  );
}

function RequestCard({ refNo, tenantName, status, date, expanded, onToggle, children }: {
  refNo: string; tenantName: string; status: string; date: string;
  expanded: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex-1 flex items-center gap-4">
          <span className="font-mono text-xs text-primary-700 font-semibold">{refNo}</span>
          <span className="text-sm font-semibold text-gray-900">{tenantName}</span>
          <StatusPill status={status} />
        </div>
        <span className="text-xs text-gray-400">{format(parseISO(date), "dd MMM yyyy")}</span>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-gray-50 pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DsrCard({ dsr, onResolve, deciding, expanded, onToggle }: {
  dsr: DataSubjectRequestOut; onResolve: (id: number, response: string) => void;
  deciding: boolean; expanded: boolean; onToggle: () => void;
}) {
  const [response, setResponse] = useState(dsr.response ?? "");
  const TYPE_LABELS: Record<string, string> = {
    access: "Right of Access", rectification: "Right of Rectification",
    erasure: "Right of Erasure", portability: "Right to Data Portability", objection: "Right to Object",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <div className="flex-1 flex items-center gap-4">
          <span className="font-mono text-xs text-primary-700 font-semibold">{dsr.reference_number}</span>
          <span className="text-sm font-semibold text-gray-900">{dsr.requester_name}</span>
          <span className="text-xs px-2.5 py-0.5 bg-purple-100 text-purple-700 font-semibold rounded-full">{TYPE_LABELS[dsr.request_type] ?? dsr.request_type}</span>
          <StatusPill status={dsr.status} />
        </div>
        <span className="text-xs text-gray-400">{format(parseISO(dsr.created_at), "dd MMM yyyy")}</span>
        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-5 pb-5 border-t border-gray-50 pt-4">
              {dsr.description && <Detail label="Description" value={dsr.description} full />}
              {dsr.status === "pending" && (
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-bold text-gray-700">Response to Data Subject</label>
                  <textarea
                    rows={3}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Describe what action was taken…"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  />
                  <button
                    onClick={() => onResolve(dsr.id, response)}
                    disabled={deciding || !response.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-950 text-gold-400 text-xs font-bold rounded-lg hover:bg-primary-900 transition-all disabled:opacity-50"
                  >
                    {deciding ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                    Mark as Resolved
                  </button>
                </div>
              )}
              {dsr.response && <Detail label="Resolution" value={dsr.response} full />}
              {dsr.resolved_at && <p className="text-xs text-gray-400 mt-2">Resolved on {format(parseISO(dsr.resolved_at), "dd MMM yyyy")}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Detail({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-3" : ""}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-gray-800">{value}</p>
    </div>
  );
}
