"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import {
  Building2, Users, TrendingUp, Wrench, CreditCard,
  BarChart3, Shield, Smartphone, ChevronRight,
  CheckCircle2, Zap, Clock, Award, ArrowUpRight,
} from "lucide-react";
import { useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 w-full bg-[#0D2818] border-b border-gold-500/10 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-28">

            {/* Left — logo */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/logo_transparent.png"
                alt="Zariva Africa Properties"
                className="h-28 w-auto object-contain"
              />
            </motion.a>

            {/* Right — all nav links + CTA */}
            <div className="hidden md:flex items-center gap-10">
              {["Features", "Benefits", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-gold-200/70 hover:text-gold-300 font-semibold transition-colors duration-200 tracking-wide"
                >
                  {item}
                </a>
              ))}
              <a href="/login" className="text-sm text-gold-300/70 hover:text-gold-200 font-semibold transition-colors tracking-wide">
                Sign In
              </a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-xs px-5 py-2.5 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold rounded-lg transition-colors tracking-wide"
              >
                Get Started
              </motion.a>
            </div>

          </div>
        </div>

        {/* Subtle gold line under nav */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-28 overflow-hidden">

        {/* Aurora Background */}
        <div className="absolute inset-0 bg-[#0D2818]">
          <motion.div
            className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, #C9A843 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #2D6040 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: "radial-gradient(circle, #C9A843 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
          {/* Noise overlay for texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "200px" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold tracking-widest uppercase">
                  <Award size={12} />
                  Your Trusted Real Estate Partner
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight"
              >
                Property<br />Management{" "}
                <span className="text-gold-shimmer">Reimagined.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-lg text-white/60 leading-relaxed max-w-lg"
              >
                Modern, elegant property management built for Kenya.
                Track payments, manage maintenance, and streamline operations — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.a
                  href="/landlord"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gold-500 hover:bg-gold-400 text-primary-950 font-bold rounded-xl transition-all shadow-xl shadow-gold-900/40 text-sm"
                >
                  Landlord Portal
                  <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.a>
                <motion.a
                  href="/tenant"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/8 hover:bg-white/12 text-white font-semibold rounded-xl transition-all border border-white/15 text-sm backdrop-blur-sm"
                >
                  Tenant Portal
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-2"
              >
                <div className="flex -space-x-2.5">
                  {["#2D6040","#C9A843","#1A3626","#8B6914"].map((color, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
                      className="w-9 h-9 rounded-full border-2 border-primary-950"
                      style={{ background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color})` }}
                    />
                  ))}
                </div>
                <div className="text-white/60 text-sm">
                  <span className="text-white font-bold">500+</span> property owners trust Zariva
                </div>
              </motion.div>
            </div>

            {/* Right — Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gold-500/10 blur-3xl rounded-3xl transform scale-95" />

              <div className="relative glass-card rounded-3xl p-6 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest">Live Dashboard</p>
                    <p className="text-white font-bold text-lg">Portfolio Overview</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>

                {/* Revenue card */}
                <motion.div
                  className="bg-white/8 rounded-2xl p-5 border border-white/10"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.12)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/60 text-sm">Monthly Revenue</span>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <ArrowUpRight size={14} /> 12%
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white num">KES 2.45M</p>
                  <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-1.5">78% of annual target</p>
                </motion.div>

                {/* Mini stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Building2, value: "12", label: "Properties" },
                    { icon: Users, value: "42", label: "Tenants" },
                    { icon: Wrench, value: "5", label: "Requests" },
                  ].map(({ icon: Icon, value, label }, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                      className="bg-white/6 rounded-xl p-3 border border-white/8 text-center"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                    >
                      <Icon size={18} className="text-gold-400 mx-auto mb-1.5" />
                      <p className="text-white font-bold text-lg num">{value}</p>
                      <p className="text-white/40 text-[10px]">{label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Occupancy bar */}
                <div className="bg-white/6 rounded-xl p-4 border border-white/8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 text-xs">Portfolio Occupancy</span>
                    <span className="text-gold-400 text-xs font-bold">87.5%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-gold-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "87.5%" }}
                      transition={{ delay: 1.1, duration: 1.4, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section id="features" className="relative py-24 px-6 lg:px-8 bg-white overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, rgba(26,54,38,0.22) 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }}
        />
        {/* Gold glow — top center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-400/10 blur-3xl rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-3">Platform Features</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Everything You Need to{" "}
              <span className="text-gold-shimmer">Succeed</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Powerful features designed for modern property management in Kenya
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, title: "Real-time Analytics", description: "Track occupancy rates, revenue, and expenses with beautiful dashboards and charts.", accent: "text-primary-600" },
              { icon: Wrench, title: "Maintenance Management", description: "Submit, track, and resolve maintenance requests with photo attachments and status updates.", accent: "text-gold-600" },
              { icon: CreditCard, title: "M-Pesa Integration", description: "Accept rent payments instantly via M-Pesa and bank transfers with automatic receipts.", accent: "text-primary-600" },
              { icon: Smartphone, title: "Mobile First", description: "Fully responsive design that works perfectly on phones, tablets, and desktops.", accent: "text-gold-600" },
              { icon: Shield, title: "Secure & Compliant", description: "Bank-level security with Kenyan rental law compliance built in from day one.", accent: "text-primary-600" },
              { icon: Users, title: "Tenant Portal", description: "Give tenants a beautiful space to pay rent, log issues, and track their lease.", accent: "text-gold-600" },
            ].map((feature, index) => (
              <SpotlightCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────── */}
      <section id="benefits" className="py-24 px-6 lg:px-8 bg-primary-950 relative overflow-hidden">
        {/* Animated dot grid */}
        <motion.div
          className="absolute inset-0 opacity-[0.06]"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 30, repeat: Infinity, repeatType: "reverse" }}
          style={{ backgroundImage: "radial-gradient(circle, #C9A843 1px, transparent 1px)", backgroundSize: "48px 48px" }}
        />
        {/* Gold glow top-right */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold-500/8 blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-gold-500 font-semibold mb-3">Why Zariva</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Built for Kenya.<br />
                  <span className="text-gold-shimmer">Built to Last.</span>
                </h2>
              </div>
              <p className="text-lg text-white/50 leading-relaxed">
                Designed specifically for the Kenyan market with features landlords and tenants actually need.
              </p>

              <div className="space-y-4">
                {[
                  { text: "Save 10+ hours per week on property management", icon: Clock },
                  { text: "Reduce late payments by 40% with automated reminders", icon: TrendingUp },
                  { text: "Handle maintenance 3x faster with digital workflows", icon: Zap },
                  { text: "Access your data anywhere, anytime on any device", icon: Smartphone },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <div className="w-6 h-6 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500/25 transition-colors">
                      <CheckCircle2 size={14} className="text-gold-400" />
                    </div>
                    <p className="text-white/70 group-hover:text-white/90 transition-colors">{benefit.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <StatsCard />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold">Get Started Today</p>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
              Ready to Transform Your{" "}
              <span className="text-gold-shimmer">Properties?</span>
            </h2>
            <p className="text-lg text-gray-500">
              Join hundreds of property owners who have simplified their operations with Zariva.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-950 hover:bg-primary-900 text-gold-400 font-bold rounded-xl transition-all shadow-xl border border-gold-500/20"
              >
                Start Free Trial
                <ChevronRight size={18} />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all border-2 border-gray-200"
              >
                Schedule Demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer id="contact" className="relative bg-primary-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-700/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <img src="/logo_transparent.png" alt="Zariva Africa Properties" className="h-24 w-auto object-contain mb-5" />
              <p className="text-white/50 mb-6 leading-relaxed text-sm max-w-xs">
                Transforming property management in Kenya with modern technology and unmatched service.
              </p>
              <div className="flex gap-3">
                {[
                  "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                ].map((path, i) => (
                  <motion.a key={i} href="#" whileHover={{ scale: 1.15 }} className="w-9 h-9 bg-white/8 hover:bg-gold-500 rounded-full flex items-center justify-center transition-all group">
                    <svg className="w-4 h-4 text-white/50 group-hover:text-primary-950" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-5 text-gold-400 uppercase tracking-widest">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Landlord Portal", href: "/landlord" },
                  { name: "Tenant Portal", href: "/tenant" },
                  { name: "Features", href: "#features" },
                  { name: "Sign Up", href: "/signup" },
                ].map((link, i) => (
                  <li key={i}>
                    <a href={link.href} className="text-sm text-white/50 hover:text-gold-400 transition-colors flex items-center gap-1.5 group">
                      <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold mb-5 text-gold-400 uppercase tracking-widest">Contact</h3>
              <ul className="space-y-4 text-sm text-white/50">
                <li className="flex items-start gap-2.5">
                  <Building2 size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <span>P.O. Box 15842<br />Nairobi, Kenya</span>
                </li>
                <li>
                  <a href="mailto:info@zariafrica.com" className="flex items-center gap-2.5 hover:text-gold-400 transition-colors">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@zariafrica.com
                  </a>
                </li>
                <li>
                  <a href="tel:+254708688507" className="flex items-center gap-2.5 hover:text-gold-400 transition-colors">
                    <svg className="w-4 h-4 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +254 708 688 507
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">© 2026 Zariva Africa Properties Ltd. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, i) => (
                <a key={i} href="#" className="text-white/30 hover:text-gold-400 transition-colors text-sm">{item}</a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </footer>
    </div>
  );
}

/* ── Spotlight Feature Card ───────────────────────────────────────── */
function SpotlightCard({ feature, index }: { feature: any; index: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = feature.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:border-gold-300 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-default"
    >
      {/* Spotlight gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(201,168,67,0.07), transparent 70%)`
            : "none",
        }}
      />

      <div className="relative z-10">
        <div className={`mb-5 inline-flex p-3 rounded-xl bg-primary-50 ${feature.accent}`}>
          <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-800 transition-colors">
          {feature.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

/* ── Stats Card ───────────────────────────────────────────────────── */
function StatsCard() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="glass-card rounded-2xl p-8"
    >
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">Trusted By</p>
          <p className="text-white font-extrabold num" style={{ fontSize: "clamp(3rem, 8vw, 5rem)", lineHeight: 1 }}>
            {inView ? <CountUp end={500} duration={2.5} /> : "0"}+
          </p>
          <p className="text-white/40 mt-2 text-sm">Property Owners in Nairobi</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-white font-extrabold text-4xl num">
              {inView ? <CountUp end={98} duration={2} /> : "0"}%
            </p>
            <p className="text-white/40 text-sm mt-1">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-white font-extrabold text-4xl">24/7</p>
            <p className="text-white/40 text-sm mt-1">Support Available</p>
          </div>
        </div>

        <div className="bg-white/6 rounded-xl p-4 border border-gold-500/15">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
              <Award size={16} className="text-gold-400" />
            </div>
            <p className="text-white/60 text-sm">
              <span className="text-white font-semibold">Ranked #1</span> property platform in Nairobi 2025
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
