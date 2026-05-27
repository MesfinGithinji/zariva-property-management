"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);
      toast.success(`Welcome back, ${user.full_name.split(" ")[0]}!`);
      router.push(user.role === "landlord" ? "/landlord" : "/tenant");
    } catch (err: any) {
      toast.error(err.message ?? "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2">

      {/* ── Left — Brand Panel ────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden bg-[#0D2818]">
        {/* Aurora blobs */}
        <motion.div
          className="absolute top-[-15%] right-[-10%] w-120 h-120 rounded-full opacity-25 pointer-events-none"
          style={{ background: "radial-gradient(circle, #C9A843 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.18, 1], x: [0, 25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-15%] left-[-10%] w-95 h-95 rounded-full opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #2D6040 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.22, 1], y: [0, -25, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }}
        />

        {/* Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <img src="/logo_transparent.png" alt="Zariva Africa Properties" className="h-20 w-auto object-contain" />
        </motion.a>

        {/* Headline + bullets */}
        <div className="relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold text-white leading-[1.1] tracking-tight mb-4">
              Welcome back<br />to <span className="text-gold-shimmer">Zariva.</span>
            </h1>
            <p className="text-white/50 text-base leading-relaxed max-w-sm">
              Your complete property management platform — built for Kenya, designed for you.
            </p>
          </motion.div>

          <div className="space-y-3.5">
            {[
              "Real-time property analytics & dashboards",
              "Automated rent collection with M-Pesa",
              "Digital maintenance request tracking",
              "Secure, 24/7 portal access",
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} className="text-gold-400" />
                </div>
                <p className="text-white/65 text-sm">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer note */}
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
      <div className="flex items-center justify-center min-h-screen lg:min-h-0 p-6 lg:p-12 bg-gray-50">
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

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Sign in</h2>
              <p className="text-gray-500 text-sm">Access your Zariva dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-950 focus:ring-2 focus:ring-gold-500/20 focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary-950 border-gray-300 rounded" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-700 hover:text-gold-600 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full py-3.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-gold-500/20 text-sm"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary-700 hover:text-gold-600 font-semibold transition-colors">
                Sign up free
              </a>
            </p>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <Shield size={12} />
              <span>256-bit SSL encrypted</span>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
