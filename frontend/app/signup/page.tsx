"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, Home, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"landlord" | "tenant">("landlord");
  const [loading, setLoading] = useState(false);

  const stats = [
    { value: "500+", label: "Properties" },
    { value: "98%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
    { value: "10K+", label: "Happy Users" },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.info("Account registration coming soon! Use the demo credentials to explore.");
    }, 800);
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2">

      {/* ── Left — Brand Panel ────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden bg-[#0D2818]">
        {/* Aurora blobs */}
        <motion.div
          className="absolute top-[-10%] right-[-15%] w-112 h-112 rounded-full opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A843 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] left-[-10%] w-90 h-90 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #2D6040 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.25, 1], x: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }}
        />

        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <img src="/logo_transparent.png" alt="Zariva Africa Properties" className="h-20 w-auto object-contain" />
        </motion.a>

        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
              Start managing<br />
              <span className="text-gold-shimmer">smarter today.</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Join thousands of landlords and tenants across Kenya who trust Zariva for seamless property management.
            </p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="bg-white/6 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
              >
                <p className="text-3xl font-extrabold text-white num">{stat.value}</p>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 flex items-center gap-2 text-white/25 text-xs"
        >
          <Shield size={12} />
          <span>Compliant with Kenya Data Protection Act No. 24 of 2019</span>
        </motion.div>
      </div>

      {/* ── Right — Form Panel ────────────────────────────────────── */}
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 p-6 lg:p-10 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <a href="/">
              <img src="/logo_transparent.png" alt="Zariva" className="h-16 w-auto object-contain mx-auto" />
            </a>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-h-[88vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Create account</h2>
              <p className="text-gray-500 text-sm">Get started with Zariva today</p>
            </div>

            {/* User type toggle */}
            <div className="flex gap-3 mb-6 p-1.5 bg-gray-100 rounded-xl">
              {(["landlord", "tenant"] as const).map((type) => {
                const Icon = type === "landlord" ? Building2 : Home;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm capitalize ${
                      userType === type
                        ? "bg-primary-950 text-gold-400 shadow-md border border-gold-500/20"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={16} />
                    {type}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="John Kamau"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Phone className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="tel"
                    placeholder="+254 712 345 678"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1">
                <input type="checkbox" id="terms"
                  className="mt-0.5 w-4 h-4 accent-primary-950 border-gray-300 rounded shrink-0" />
                <label htmlFor="terms" className="text-sm text-gray-500">
                  I agree to the{" "}
                  <a href="#" className="text-primary-700 hover:text-gold-600 font-semibold transition-colors">Terms of Service</a>
                  {" "}and{" "}
                  <a href="/privacy" className="text-primary-700 hover:text-gold-600 font-semibold transition-colors">Privacy Policy</a>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-gold-500/20 text-sm mt-2"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </motion.button>

              {/* Social signup */}
              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Google", icon: <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
                  { label: "GitHub", icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> },
                ].map(({ label, icon }) => (
                  <motion.button
                    key={label}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toast.info(`${label} sign-up coming soon!`)}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-gray-700 transition-all text-sm"
                  >
                    {icon}
                    {label}
                  </motion.button>
                ))}
              </div>
            </form>

            <p className="mt-5 text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-primary-700 hover:text-gold-600 font-semibold transition-colors">Sign in</a>
            </p>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Shield size={12} />
              <span>256-bit SSL encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
