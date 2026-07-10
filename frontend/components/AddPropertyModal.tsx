"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MapPin, X, Plus, Trash2, ArrowRight, ArrowLeft,
  CheckCircle2, Loader2, Home,
} from "lucide-react";
import { api, type PropertyOut } from "@/lib/api";
import { toast } from "sonner";

const PROPERTY_TYPES = ["Apartment", "Commercial", "Villa", "Mixed Use"] as const;

interface UnitDraft {
  unit_number: string;
  type: string;
  floor: string;
  rent_amount: string;
}

interface AddPropertyModalProps {
  onClose: () => void;
  /** Called with the newly created property once the whole flow completes. */
  onCreated: (property: PropertyOut) => void;
}

function emptyUnit(): UnitDraft {
  return { unit_number: "", type: "2BR", floor: "", rent_amount: "" };
}

export default function AddPropertyModal({ onClose, onCreated }: AddPropertyModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1 — property
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState<string>("Apartment");
  const [yearBuilt, setYearBuilt] = useState("");
  const [propertyValue, setPropertyValue] = useState("");

  // The property id, once created (so we don't recreate it if unit step is retried)
  const [createdProperty, setCreatedProperty] = useState<PropertyOut | null>(null);

  // Step 2 — units
  const [units, setUnits] = useState<UnitDraft[]>([emptyUnit()]);

  function updateUnit(i: number, patch: Partial<UnitDraft>) {
    setUnits((prev) => prev.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));
  }
  function addUnitRow() {
    setUnits((prev) => [...prev, emptyUnit()]);
  }
  function removeUnitRow(i: number) {
    setUnits((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));
  }

  async function handleCreateProperty() {
    if (!name.trim() || !location.trim() || !address.trim()) {
      toast.error("Please fill in the property name, location, and address.");
      return;
    }
    setSubmitting(true);
    try {
      const prop = await api.post<PropertyOut>("/properties", {
        name: name.trim(),
        location: location.trim(),
        address: address.trim(),
        type,
        year_built: yearBuilt ? parseInt(yearBuilt, 10) : undefined,
        property_value: propertyValue ? parseFloat(propertyValue) : undefined,
      });
      setCreatedProperty(prop);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message ?? "Could not create the property.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddUnits() {
    if (!createdProperty) return;

    // Only submit units that have a number + rent; blank rows are skipped.
    const valid = units.filter((u) => u.unit_number.trim() && u.rent_amount);
    setSubmitting(true);
    try {
      for (const u of valid) {
        await api.post("/units", {
          property_id: createdProperty.id,
          unit_number: u.unit_number.trim(),
          type: u.type.trim() || "Unit",
          floor: u.floor ? parseInt(u.floor, 10) : undefined,
          rent_amount: parseFloat(u.rent_amount),
        });
      }
      toast.success(
        valid.length > 0
          ? `${createdProperty.name} added with ${valid.length} unit${valid.length > 1 ? "s" : ""}.`
          : `${createdProperty.name} added.`,
      );
      onCreated(createdProperty);
    } catch (err: any) {
      toast.error(err.message ?? "The property was created, but adding units failed.");
    } finally {
      setSubmitting(false);
    }
  }

  function finishWithoutUnits() {
    if (createdProperty) {
      toast.success(`${createdProperty.name} added. You can add units later.`);
      onCreated(createdProperty);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-950 to-primary-900 px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 rounded-lg">
              <Building2 className="text-gold-400" size={20} />
            </div>
            <div>
              <h2 className="text-white text-lg font-bold">Add Property</h2>
              <p className="text-white/50 text-xs">Step {step} of 2 — {step === 1 ? "Property details" : "Add units"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X size={18} className="text-white/70" />
          </button>
        </div>

        {/* Step progress bar */}
        <div className="h-1 bg-gray-100 shrink-0">
          <motion.div
            className="h-full bg-gold-500"
            initial={false}
            animate={{ width: step === 1 ? "50%" : "100%" }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <Field label="Property Name" required>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Riverside Court"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Location" required>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Kilimani, Nairobi"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </Field>
                  <Field label="Property Type">
                    <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Address" required>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address"
                    className={inputCls}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Year Built">
                    <input
                      type="number"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="2020"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Property Value (KES)">
                    <input
                      type="number"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      placeholder="50000000"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-sm text-primary-800 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2">
                  <CheckCircle2 size={15} className="text-primary-600 shrink-0" />
                  <span><strong>{createdProperty?.name}</strong> created. Now add its units so tenants can join.</span>
                </div>

                {units.map((u, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 p-3 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                        <Home size={12} /> Unit {i + 1}
                      </span>
                      {units.length > 1 && (
                        <button onClick={() => removeUnitRow(i)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={u.unit_number}
                        onChange={(e) => updateUnit(i, { unit_number: e.target.value })}
                        placeholder="Unit no. (e.g. A1)"
                        className={smallInputCls}
                      />
                      <input
                        type="text"
                        value={u.type}
                        onChange={(e) => updateUnit(i, { type: e.target.value })}
                        placeholder="Type (e.g. 2BR)"
                        className={smallInputCls}
                      />
                      <input
                        type="number"
                        value={u.floor}
                        onChange={(e) => updateUnit(i, { floor: e.target.value })}
                        placeholder="Floor"
                        className={smallInputCls}
                      />
                      <input
                        type="number"
                        value={u.rent_amount}
                        onChange={(e) => updateUnit(i, { rent_amount: e.target.value })}
                        placeholder="Rent (KES)"
                        className={smallInputCls}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addUnitRow}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all"
                >
                  <Plus size={15} /> Add another unit
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50 flex items-center gap-3">
          {step === 1 ? (
            <button
              onClick={handleCreateProperty}
              disabled={submitting}
              className="w-full py-3 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <>Continue to units <ArrowRight size={15} /></>}
            </button>
          ) : (
            <>
              <button
                onClick={finishWithoutUnits}
                disabled={submitting}
                className="px-4 py-3 text-gray-500 hover:text-gray-700 font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
              >
                Skip for now
              </button>
              <button
                onClick={handleAddUnits}
                disabled={submitting}
                className="flex-1 py-3 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle2 size={15} /> Finish</>}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all";
const smallInputCls =
  "w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
