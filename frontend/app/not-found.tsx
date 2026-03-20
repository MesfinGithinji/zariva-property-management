"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-gold-50 to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <a href="/">
            <img
              src="/logo_transparent.png"
              alt="Zariva"
              className="h-24 w-auto object-contain mx-auto drop-shadow-2xl"
            />
          </a>
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-600 mb-4">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all"
          >
            <Home size={20} />
            Back to Home
          </motion.a>
          <motion.a
            href="/landlord"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-xl border-2 border-primary-200 shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
            Go to Dashboard
          </motion.a>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Landlord Dashboard", href: "/landlord" },
              { name: "Tenant Dashboard", href: "/tenant" },
              { name: "Properties", href: "/landlord/properties" },
              { name: "Payments", href: "/tenant/payments" },
            ].map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="px-4 py-2 bg-white hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-lg font-medium transition-all border border-gray-200 hover:border-primary-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
