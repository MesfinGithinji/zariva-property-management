"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Building2, MapPin, Send, Clock, XCircle,
  CheckCircle2, Loader2, ArrowRight,
} from "lucide-react";
import { api, type PropertySearchResult, type JoinRequestOut } from "@/lib/api";
import { toast } from "sonner";

interface JoinPropertyProps {
  /** Called after an approved request is detected, so the parent can refresh the lease. */
  onApproved?: () => void;
}

export default function JoinProperty({ onApproved }: JoinPropertyProps) {
  const [requests, setRequests] = useState<JoinRequestOut[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PropertySearchResult[]>([]);
  const [searched, setSearched] = useState(false);

  const [selected, setSelected] = useState<PropertySearchResult | null>(null);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pending = requests.find((r) => r.status === "pending");
  const declined = requests.find((r) => r.status === "declined");

  async function loadRequests() {
    try {
      const reqs = await api.get<JoinRequestOut[]>("/join-requests/me");
      setRequests(reqs);
      if (reqs.some((r) => r.status === "approved" || r.status === "approved_with_modifications")) {
        onApproved?.();
      }
    } catch {
      // no requests yet — fine
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setSearched(true);
    try {
      const found = await api.get<PropertySearchResult[]>(
        `/join-requests/properties/search?q=${encodeURIComponent(query.trim())}`,
      );
      setResults(found);
    } catch (err: any) {
      toast.error(err.message ?? "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    try {
      await api.post<JoinRequestOut>("/join-requests", {
        property_id: selected.id,
        message: message.trim() || undefined,
      });
      toast.success("Request sent! Your landlord will review it shortly.");
      setSelected(null);
      setMessage("");
      setResults([]);
      setQuery("");
      setSearched(false);
      await loadRequests();
    } catch (err: any) {
      toast.error(err.message ?? "Could not send request.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-primary-700" size={28} />
      </div>
    );
  }

  // ── Pending state ──────────────────────────────────────────────────────────
  if (pending) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
          <Clock className="text-amber-600" size={30} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Pending</h2>
        <p className="text-gray-600 mb-1">
          Your request to join <span className="font-semibold">{pending.property_name}</span> has been sent.
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Awaiting approval from your landlord. You'll see your unit and lease here once approved.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 font-mono">
          Ref: {pending.reference_number}
        </div>
      </motion.div>
    );
  }

  // ── Search / request state (also shown after a decline, with the notice above) ──
  return (
    <div className="max-w-xl mx-auto">
      {declined && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div className="text-sm">
            <p className="font-semibold text-red-800">
              Your previous request to {declined.property_name} was declined.
            </p>
            {declined.decline_reason && (
              <p className="text-red-600 mt-0.5">Reason: {declined.decline_reason}</p>
            )}
            <p className="text-red-500 mt-1">You can search and request again below.</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary-950 flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-gold-400" size={26} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Join your property</h2>
          <p className="text-gray-500 text-sm">
            Search for your property by name or your landlord's email to request access.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Property name or landlord email"
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !query.trim()}
            className="px-5 py-3 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all disabled:opacity-60 flex items-center gap-2 text-sm"
          >
            {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            Search
          </button>
        </form>

        {/* Results */}
        <div className="space-y-2">
          {searched && !searching && results.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">
              No properties found. Try your landlord's email or the exact property name.
            </p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selected?.id === p.id
                  ? "border-primary-950 bg-primary-950/[0.03]"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                <Building2 className="text-gray-600" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={11} /> {p.location}
                  {p.landlord_name && <span className="text-gray-400">· {p.landlord_name}</span>}
                </p>
              </div>
              {selected?.id === p.id && <CheckCircle2 className="text-primary-950 shrink-0" size={18} />}
            </button>
          ))}
        </div>

        {/* Optional message + submit */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-5 pt-5 border-t border-gray-100"
          >
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
              Message to landlord (optional)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. I'm the tenant moving into unit 4B on the 15th"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 transition-all resize-none mb-4"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Request to join {selected.name} <ArrowRight size={15} /></>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
