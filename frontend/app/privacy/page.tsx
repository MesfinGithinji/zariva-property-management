"use client";

import { motion } from "framer-motion";
import { Shield, Mail, ArrowLeft } from "lucide-react";

const DATA_CATEGORIES = [
  { label: "Identity data", detail: "full name, national ID number, passport number, photograph" },
  { label: "Contact data", detail: "physical address, email address, phone numbers" },
  { label: "Financial data", detail: "bank account details, M-Pesa number, payment history, credit information" },
  { label: "Employment data", detail: "employer name, designation, employment reference" },
  { label: "Next-of-kin data", detail: "name, relationship, contact number of emergency contact" },
  { label: "Tenancy data", detail: "lease terms, rent payment records, inspection reports, notices, correspondence" },
  { label: "Technical data", detail: "IP addresses, login details, and interaction data from the online portal" },
];

const PURPOSES = [
  { purpose: "Lease administration and rent collection", basis: "Contract", retention: "Duration of tenancy + 7 years" },
  { purpose: "Legal notices and compliance", basis: "Legal obligation", retention: "Duration of tenancy + 7 years" },
  { purpose: "Credit referencing and background checks", basis: "Legitimate interest", retention: "6 months pre-tenancy" },
  { purpose: "Marketing and service improvement", basis: "Consent (separate)", retention: "Until withdrawal of consent" },
  { purpose: "Dispute resolution and litigation", basis: "Legal obligation", retention: "Duration of dispute + 7 years" },
];

const DATA_SHARING = [
  "The Landlord of your rented property, for the purposes of administering the tenancy",
  "Authorized service contractors and maintenance providers, limited to what is necessary",
  "Credit Reference Bureaus (CRBs) registered in Kenya, in the event of default",
  "Courts, tribunals, or law enforcement agencies, where legally required",
  "Our technology and software service providers, under strict data processing agreements",
];

const RIGHTS = [
  { right: "Right of Access", detail: "You may request a copy of personal data we hold about you." },
  { right: "Right of Rectification", detail: "You may request correction of inaccurate data." },
  { right: "Right of Erasure", detail: "You may request deletion of data where no legitimate basis exists for retention." },
  { right: "Right to Object", detail: "You may object to processing for direct marketing." },
  { right: "Right to Data Portability", detail: "You may request your data in a portable format." },
  { right: "Right to Complain", detail: "You may lodge a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya." },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-white to-gray-50">
      {/* Header */}
      <div className="bg-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <a href="/" className="inline-flex items-center gap-2 text-gold-400 text-sm mb-6 hover:text-gold-300 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </a>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gold-500/20 rounded-xl">
              <Shield className="text-gold-400" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Data Protection &amp; Privacy Notice</h1>
              <p className="text-white/60 text-sm mt-1">Zariva Africa Properties Ltd — Ref: ZAP-CNS</p>
            </div>
          </div>
          <p className="text-white/70 text-sm">
            Governed by the <strong className="text-gold-400">Kenya Data Protection Act No. 24 of 2019</strong> and Regulations 2021
          </p>
          <p className="text-white/50 text-xs mt-1">Version 1.0 — Effective 1 January 2024</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">

        {/* Data Controller */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">1. Data Controller</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              ["Data Controller", "Zariva Africa Properties Ltd"],
              ["Business", "Property Management & Real Estate Services"],
              ["Contact", "info@zarivaafrica.com"],
              ["Location", "Nairobi, Kenya"],
            ].map(([label, value]) => (
              <div key={label} className="flex border-b border-gray-50 last:border-0">
                <div className="w-44 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 flex-shrink-0">{label}</div>
                <div className="px-4 py-3 text-sm text-gray-800">{value}</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Data Collected */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">2. Personal Data We Collect</h2>
          <div className="space-y-3">
            {DATA_CATEGORIES.map((cat, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-950 text-gold-400 flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{cat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Lawful Basis */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">3. Lawful Basis &amp; Purpose</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-primary-950 text-white">
                  <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                  <th className="text-left px-4 py-3 font-semibold">Lawful Basis</th>
                  <th className="text-left px-4 py-3 font-semibold">Retention Period</th>
                </tr>
              </thead>
              <tbody>
                {PURPOSES.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-4 py-3 text-gray-800">{row.purpose}</td>
                    <td className="px-4 py-3 text-gray-600">{row.basis}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{row.retention}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Data Sharing */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">4. Data Sharing</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-4">We may share your data with:</p>
            <ul className="space-y-2">
              {DATA_SHARING.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 font-medium">
              We will never sell your personal data to third parties for marketing purposes.
            </div>
          </div>
        </motion.section>

        {/* Security */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">5. Data Security</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-sm text-gray-700 leading-relaxed">
            We implement appropriate technical and organisational security measures including <strong>encryption</strong>,
            <strong> access controls</strong>, <strong>audit trails</strong>, and <strong>regular security reviews</strong> to
            protect your personal data against unauthorised access, loss, or disclosure.
          </div>
        </motion.section>

        {/* Rights */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-bold text-primary-950 border-b-2 border-gold-500 pb-2 mb-4">6. Your Rights Under the DPA 2019</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {RIGHTS.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-sm font-bold text-primary-950 mb-1">{item.right}</p>
                <p className="text-xs text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="bg-primary-950 rounded-2xl p-8 text-white text-center">
            <Mail className="mx-auto mb-3 text-gold-400" size={28} />
            <h3 className="text-lg font-bold mb-2">Exercise Your Rights</h3>
            <p className="text-white/70 text-sm mb-4">
              To exercise any of your data rights or submit a complaint, contact our Data Protection Officer:
            </p>
            <a href="mailto:info@zarivaafrica.com" className="inline-block px-6 py-2.5 bg-gold-500 text-primary-950 font-bold rounded-xl text-sm hover:bg-gold-400 transition-colors">
              info@zarivaafrica.com
            </a>
            <p className="text-white/40 text-xs mt-4">
              Or contact the ODPC directly at odpc.go.ke
            </p>
          </div>
        </motion.section>
      </div>

      <footer className="text-center py-6 text-xs text-gray-400">
        Zariva Africa Properties Ltd | Nairobi, Kenya | info@zarivaafrica.com
      </footer>
    </div>
  );
}
