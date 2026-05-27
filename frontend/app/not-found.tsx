"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Shield } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D2818] flex items-center justify-center p-6 relative overflow-hidden">

      {/* Aurora blobs */}
      <motion.div
        className="absolute top-[-10%] right-[-10%] w-120 h-120 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A843 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-15%] left-[-10%] w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #2D6040 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.3, 1], y: [0, -20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }}
      />

      <div className="max-w-lg mx-auto text-center relative z-10">

        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-10"
        >
          <img src="/logo_transparent.png" alt="Zariva" className="h-20 w-auto object-contain mx-auto" />
        </motion.a>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-[10rem] font-extrabold leading-none tracking-tight text-gold-shimmer mb-0">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">Page not found</h2>
          <p className="text-white/50 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold rounded-xl transition-all shadow-xl shadow-gold-900/30 text-sm"
          >
            <Home size={17} />
            Back to Home
          </motion.a>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl border border-white/15 transition-all text-sm backdrop-blur-sm"
          >
            <ArrowLeft size={17} />
            Go to Dashboard
          </motion.a>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-white/6 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
        >
          <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-4">Quick Links</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Landlord Dashboard", href: "/landlord" },
              { name: "Tenant Dashboard", href: "/tenant" },
              { name: "Properties", href: "/landlord/properties" },
              { name: "Payments", href: "/tenant/payments" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="px-3 py-2.5 bg-white/6 hover:bg-white/12 text-white/60 hover:text-white rounded-xl text-sm font-medium transition-all border border-white/8 hover:border-white/20"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex items-center justify-center gap-1.5 text-white/20 text-xs"
        >
          <Shield size={11} />
          <span>Zariva Africa Properties Ltd — Nairobi, Kenya</span>
        </motion.div>
      </div>
    </div>
  );
}
