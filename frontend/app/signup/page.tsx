"use client";

import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, Home, ArrowRight, Shield, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"landlord" | "tenant">("landlord");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const router = useRouter();
  const { setUser } = useAuth();

  const stats = [
    { value: "500+", label: "Properties" },
    { value: "98%", label: "Satisfaction" },
    { value: "24/7", label: "Support" },
    { value: "10K+", label: "Happy Users" },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !password) {
      toast.error("Please fill in your name, email, and password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role: userType,
      });
      setUser(user);
      toast.success(`Welcome to Zariva, ${user.full_name.split(" ")[0]}!`);
      router.push(user.role === "landlord" ? "/landlord" : "/tenant");
    } catch (err: any) {
      toast.error(err.message ?? "Could not create your account. Please try again.");
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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Kamau"
                    autoComplete="name"
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    autoComplete="tel"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
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
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
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
