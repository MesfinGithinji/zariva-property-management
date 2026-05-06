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
    <div className="min-h-screen bg-gradient-to-br from-cream via-gold-50 to-primary-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:block"
        >
          <motion.a href="/" className="inline-block mb-8">
            <img src="/logo_transparent.png" alt="Zariva" className="h-24 w-auto object-contain drop-shadow-2xl" />
          </motion.a>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome Back to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-600">Zariva</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">Manage your properties effortlessly with our modern platform</p>
          <div className="space-y-4">
            {["Real-time property analytics", "Automated rent collection", "Digital maintenance tracking", "24/7 support access"].map(
              (benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle2 className="text-green-600" size={20} />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ),
            )}
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl"
        >
          <div className="lg:hidden mb-8">
            <a href="/">
              <img src="/logo_transparent.png" alt="Zariva" className="h-20 w-auto object-contain mx-auto" />
            </a>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">Access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail className="text-gray-400" size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="text-gray-400" size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                Forgot password?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            {/* Demo credentials */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 space-y-1">
              <p className="font-semibold text-gray-700 mb-2">Demo credentials</p>
              <p>
                Landlord: <span className="font-mono">matty@zariva.com</span> /{" "}
                <span className="font-mono">zariva123</span>
              </p>
              <p>
                Tenant: <span className="font-mono">john.kamau@email.com</span> /{" "}
                <span className="font-mono">tenant123</span>
              </p>
            </div>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign up
            </a>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <Shield size={16} />
            <span>Secured with 256-bit SSL encryption</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
