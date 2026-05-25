"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, CheckCircle2, ChevronDown, ChevronUp, Loader2, AlertTriangle } from "lucide-react";
import { api, type ConsentOut } from "@/lib/api";
import { toast } from "sonner";

interface ConsentModalProps {
  onConsented: (record: ConsentOut) => void;
}

const DATA_CATEGORIES = [
  "Identity data: full name, national ID number, passport number, photograph",
  "Contact data: physical address, email address, phone numbers",
  "Financial data: bank account details, M-Pesa number, payment history, credit information",
  "Employment data: employer name, designation, employment reference",
  "Next-of-kin data: name, relationship, contact number of emergency contact",
  "Tenancy data: lease terms, rent payment records, inspection reports, notices, correspondence",
  "Technical data: IP addresses, login details, and interaction data from the online portal",
];

const PURPOSES = [
  { purpose: "Lease administration and rent collection", basis: "Contract", retention: "Duration of tenancy + 7 years" },
  { purpose: "Legal notices and compliance", basis: "Legal obligation", retention: "Duration of tenancy + 7 years" },
  { purpose: "Credit referencing and background checks", basis: "Legitimate interest", retention: "6 months pre-tenancy" },
  { purpose: "Marketing and service improvement", basis: "Consent (separate)", retention: "Until withdrawal of consent" },
  { purpose: "Dispute resolution and litigation", basis: "Legal obligation", retention: "Duration of dispute + 7 years" },
];

export default function ConsentModal({ onConsented }: ConsentModalProps) {
  const [expanded, setExpanded] = useState(false);
  const [leaseAdmin, setLeaseAdmin] = useState(false);
  const [communications, setCommunications] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = leaseAdmin && communications;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const record = await api.post<ConsentOut>("/consent", {
        lease_admin_consent: leaseAdmin,
        communications_consent: communications,
        marketing_consent: marketing,
        national_id: nationalId || undefined,
      });
      toast.success("Consent recorded. Welcome to Zariva.");
      onConsented(record);
    } catch (err: any) {
      toast.error(err.message ?? "Failed to record consent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-950 to-primary-900 px-8 py-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Shield className="text-gold-400" size={22} />
            </div>
            <div>
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest">Data Protection & Privacy</p>
              <h2 className="text-white text-xl font-bold">Consent & Privacy Notice</h2>
            </div>
          </div>
          <p className="text-white/60 text-xs mt-1">
            Governed by the Kenya Data Protection Act No. 24 of 2019 and Regulations 2021
          </p>
          <p className="text-white/60 text-xs">Ref: ZAP-CNS — Zariva Africa Properties Ltd</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

          {/* Intro */}
          <p className="text-gray-600 text-sm leading-relaxed">
            This notice sets out how Zariva Africa Properties Ltd collects, uses, stores, and shares
            your personal data in connection with your tenancy. Please read carefully before consenting.
          </p>

          {/* Data collected */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Personal Data We Collect</h3>
            <ul className="space-y-1.5">
              {DATA_CATEGORIES.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Expandable purposes table */}
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-between w-full text-sm font-bold text-gray-900 mb-2"
            >
              <span>Purposes & Legal Basis</span>
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-primary-950 text-white">
                        <th className="text-left p-2 rounded-tl font-semibold">Purpose</th>
                        <th className="text-left p-2 font-semibold">Legal Basis</th>
                        <th className="text-left p-2 rounded-tr font-semibold">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PURPOSES.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="p-2 text-gray-700">{row.purpose}</td>
                          <td className="p-2 text-gray-600">{row.basis}</td>
                          <td className="p-2 text-gray-600">{row.retention}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Data sharing */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-800 mb-2">Data Sharing</p>
            <p className="text-xs text-amber-700">
              We may share your data with: your landlord, authorized maintenance contractors, Credit Reference
              Bureaus (on default), courts and law enforcement (when legally required), and our technology
              providers under data processing agreements. We will <strong>never sell</strong> your data to
              third parties for marketing.
            </p>
          </div>

          {/* Rights */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Your Rights Under the DPA 2019</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Access", "Rectification", "Erasure", "Object", "Data Portability", "Complain to ODPC"].map((r) => (
                <div key={r} className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle2 size={12} className="text-primary-600 flex-shrink-0" />
                  Right to {r}
                </div>
              ))}
            </div>
          </div>

          {/* National ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">National ID Number (optional)</label>
            <input
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="e.g. 12345678"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Consent Declaration */}
          <div className="border-2 border-primary-950/20 rounded-xl p-5 space-y-4 bg-primary-950/[0.02]">
            <p className="text-xs font-bold text-primary-950 uppercase tracking-wide">Consent Declaration</p>
            <p className="text-xs text-gray-600">Having read and understood the above Privacy Notice, I hereby:</p>

            {/* Mandatory 1 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setLeaseAdmin(!leaseAdmin)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  leaseAdmin ? "bg-primary-950 border-primary-950" : "border-gray-300 bg-white"
                }`}
              >
                {leaseAdmin && <CheckCircle2 size={13} className="text-gold-400" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-800">
                  CONSENT to the collection and processing of my personal data as described above for
                  lease administration purposes.
                </span>
                <span className="block text-xs text-red-600 font-medium mt-0.5">Required</span>
              </div>
            </label>

            {/* Mandatory 2 */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setCommunications(!communications)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  communications ? "bg-primary-950 border-primary-950" : "border-gray-300 bg-white"
                }`}
              >
                {communications && <CheckCircle2 size={13} className="text-gold-400" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-800">
                  CONSENT to being contacted via SMS, email, or the online portal for tenancy-related
                  communications.
                </span>
                <span className="block text-xs text-red-600 font-medium mt-0.5">Required</span>
              </div>
            </label>

            {/* Optional */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setMarketing(!marketing)}
                className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all ${
                  marketing ? "bg-gold-500 border-gold-500" : "border-gray-300 bg-white"
                }`}
              >
                {marketing && <CheckCircle2 size={13} className="text-white" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-800">
                  CONSENT (optional) to receive promotional materials and property listings from
                  Zariva Africa Properties Ltd.
                </span>
                <span className="block text-xs text-gray-400 font-medium mt-0.5">Optional — you can change this anytime in Settings</span>
              </div>
            </label>
          </div>

          {!canSubmit && (
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="flex-shrink-0" />
              Please tick both required consent boxes above to continue.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex-shrink-0 bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              canSubmit
                ? "bg-primary-950 hover:bg-primary-900 text-gold-400 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Recording consent…</>
            ) : (
              <><Shield size={16} /> I Consent & Agree — Continue to Dashboard</>
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            You can manage your consent preferences anytime in Settings → Privacy & Rights
          </p>
        </div>
      </motion.div>
    </div>
  );
}
