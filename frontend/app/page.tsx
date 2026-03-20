"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Building2,
  Users,
  TrendingUp,
  Wrench,
  CreditCard,
  BarChart3,
  Shield,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Zap,
  Clock,
  Award
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-gold-500 to-primary-600 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 backdrop-blur-lg border-b border-gold-500/20 z-50 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <motion.a
              href="/"
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src="/logo.png"
                alt="Zariva Africa Properties"
                className="h-20 w-auto object-contain transition-all duration-300 hover:brightness-110 drop-shadow-2xl"
              />
            </motion.a>
            <div className="hidden md:flex space-x-8">
              {["Features", "Benefits", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gold-200 hover:text-gold-400 font-medium transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex gap-3">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-gold-300 font-semibold hover:text-gold-100 transition-all duration-300"
              >
                Sign In
              </motion.a>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-primary-950 font-bold rounded-lg transition-all duration-300 shadow-lg shadow-gold-900/50"
              >
                Get Started
              </motion.a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-cream via-gold-50 to-primary-50 overflow-hidden">
        {/* Enhanced Floating Orbs with Parallax */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-gold-400/20 rounded-full blur-3xl"
          style={{
            y: useTransform(scrollYProgress, [0, 0.5], [0, -100]),
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl"
          style={{
            y: useTransform(scrollYProgress, [0, 0.5], [0, 100]),
          }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-200/10 to-primary-200/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <motion.span
                  className="px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award size={16} className="text-gold-600" />
                  Your Trusted Real Estate Partner
                </motion.span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
              >
                Property Management{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-gold-600 to-primary-600 bg-[length:200%_auto]"
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Reimagined
                </motion.span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Modern, elegant property management for landlords and tenants.
                Track payments, manage maintenance, and streamline operations—all in one place.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="/landlord"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Landlord Portal
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.a>
                <motion.a
                  href="/tenant"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300 flex items-center justify-center shadow-lg"
                >
                  Tenant Portal
                </motion.a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-8 pt-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-gold-400 border-2 border-white"
                    />
                  ))}
                </div>
                <AnimatedStat prefix="" value={500} suffix="+" label="Properties Managed" />
              </motion.div>
            </motion.div>

            {/* Right Content - Enhanced Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
              style={{
                y: useTransform(scrollYProgress, [0, 0.5], [0, -50]),
              }}
            >
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-2xl transform perspective-1000 hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] rounded-3xl" />
                <div className="relative space-y-4">
                  {/* Dashboard Preview Cards with Animations */}
                  <motion.div
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm">Monthly Revenue</span>
                      <motion.div
                        animate={{
                          y: [0, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <TrendingUp className="text-gold-400" size={20} />
                      </motion.div>
                    </div>
                    <p className="text-3xl font-bold text-white">KES 2.4M</p>
                    <p className="text-green-300 text-sm mt-2 flex items-center gap-1">
                      <Zap size={14} />
                      +12% from last month
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Building2, value: 24, label: "Properties", color: "gold" },
                      { icon: Users, value: 156, label: "Tenants", color: "gold" }
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.2 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                        >
                          <item.icon className="text-gold-400 mb-2" size={24} />
                        </motion.div>
                        <p className="text-2xl font-bold text-white">{item.value}</p>
                        <p className="text-white/70 text-xs">{item.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="features" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B4332' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-600">
                Succeed
              </span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern property management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-primary-600" size={32} />,
                title: "Real-time Analytics",
                description: "Track occupancy rates, revenue, and expenses with beautiful dashboards",
                color: "from-blue-100 to-blue-200"
              },
              {
                icon: <Wrench className="text-primary-600" size={32} />,
                title: "Maintenance Management",
                description: "Submit, track, and resolve maintenance requests with photo attachments",
                color: "from-red-100 to-red-200"
              },
              {
                icon: <CreditCard className="text-primary-600" size={32} />,
                title: "M-Pesa Integration",
                description: "Accept rent payments instantly via M-Pesa and bank transfers",
                color: "from-green-100 to-green-200"
              },
              {
                icon: <Smartphone className="text-primary-600" size={32} />,
                title: "Mobile First",
                description: "Fully responsive design works perfectly on all devices",
                color: "from-purple-100 to-purple-200"
              },
              {
                icon: <Shield className="text-primary-600" size={32} />,
                title: "Secure & Compliant",
                description: "Bank-level security with Kenyan rental law compliance",
                color: "from-yellow-100 to-yellow-200"
              },
              {
                icon: <Users className="text-primary-600" size={32} />,
                title: "Tenant Portal",
                description: "Give tenants easy access to pay rent and request maintenance",
                color: "from-pink-100 to-pink-200"
              }
            ].map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Animated Stats */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-700 to-primary-900 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{
            backgroundImage: "radial-gradient(circle, #D4AF37 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white space-y-6"
            >
              <h2 className="text-5xl font-bold">
                Why Choose <span className="text-gold-400">Zariva?</span>
              </h2>
              <p className="text-xl text-primary-100">
                Built specifically for the Kenyan market with features landlords and tenants actually need.
              </p>

              <div className="space-y-4">
                {[
                  { text: "Save 10+ hours per week on property management", icon: Clock },
                  { text: "Reduce late payments by 40% with automated reminders", icon: TrendingUp },
                  { text: "Handle maintenance 3x faster with digital workflows", icon: Zap },
                  { text: "Access your data anywhere, anytime on any device", icon: Smartphone }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                    className="flex items-start gap-3 cursor-pointer"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    >
                      <CheckCircle2 className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                    </motion.div>
                    <p className="text-lg text-primary-100">{benefit.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <StatsCard />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h2
              className="text-5xl font-bold text-gray-900"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-600">
                Property Management?
              </span>
            </motion.h2>
            <p className="text-xl text-gray-600">
              Join hundreds of property owners who have simplified their operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-xl shadow-primary-200 hover:shadow-2xl"
              >
                Start Free Trial
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300 shadow-lg"
              >
                Schedule Demo
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <motion.img
                src="/logo.png"
                alt="Zariva Africa Properties"
                className="h-20 w-auto object-contain mb-6 drop-shadow-2xl"
                whileHover={{ scale: 1.05 }}
              />
              <p className="text-gold-200 text-lg mb-6 leading-relaxed">
                Your Trusted Real Estate Partner
              </p>
              <p className="text-primary-200 mb-6">
                Transforming property management in Kenya with modern technology, elegant design, and unmatched service.
              </p>
              {/* Social Media */}
              <div className="flex gap-4">
                {[
                  { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                  { icon: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
                  { icon: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" },
                  { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 hover:bg-gold-500 rounded-full flex items-center justify-center transition-all duration-300 group"
                  >
                    <svg className="w-5 h-5 text-gold-200 group-hover:text-primary-950" fill="currentColor" viewBox="0 0 24 24"><path d={social.icon}/></svg>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gold-400">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: "Landlord Portal", href: "/landlord" },
                  { name: "Tenant Portal", href: "/tenant" },
                  { name: "Admin", href: "/admin" },
                  { name: "Features", href: "#features" }
                ].map((link, idx) => (
                  <motion.li key={idx} whileHover={{ x: 5 }}>
                    <a href={link.href} className="text-primary-200 hover:text-gold-400 transition-colors duration-300 flex items-center gap-2 group">
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-gold-400">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-primary-200">
                  <Building2 size={20} className="text-gold-400 flex-shrink-0 mt-1" />
                  <span>P.O. Box 15842<br />Nairobi, Kenya</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@zariafrica.com" className="text-primary-200 hover:text-gold-400 transition-colors">
                    info@zariafrica.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gold-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+254708688507" className="text-primary-200 hover:text-gold-400 transition-colors">
                    +254 708 688 507
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gold-900/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-primary-300 text-sm">
                © 2026 Zariva Africa Properties Ltd. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="text-primary-300 hover:text-gold-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: "200% 100%"
          }}
        />
      </footer>
    </div>
  );
}

// Animated Stat Component
function AnimatedStat({ prefix = "", value, suffix = "", label }: { prefix?: string; value: number; suffix?: string; label?: string }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div ref={ref} className="text-sm text-gray-600">
      <span className="font-bold text-gray-900">
        {prefix}
        {inView && <CountUp end={value} duration={2.5} />}
        {suffix}
      </span>
      {label && ` ${label}`}
    </div>
  );
}

// Feature Card Component
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="group relative bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-gold-300 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer"
    >
      {/* Gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary-50 to-gold-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 0, borderRadius: "100%" }}
        whileHover={{ scale: 2, borderRadius: "0%" }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative z-10">
        <motion.div
          className={`mb-4 p-3 bg-gradient-to-br ${feature.color} rounded-xl w-fit`}
          whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-800 transition-colors">{feature.title}</h3>
        <p className="text-gray-600 group-hover:text-gray-700">{feature.description}</p>
      </div>

      {/* Corner accent */}
      <motion.div
        className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gold-200 to-transparent opacity-20 rounded-bl-full"
        whileHover={{ scale: 1.5 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

// Stats Card Component
function StatsCard() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-gold-400 text-sm font-semibold mb-2">TRUSTED BY</p>
          <p className="text-white text-6xl font-bold">
            {inView && <CountUp end={500} duration={2.5} />}+
          </p>
          <p className="text-primary-200 mt-2">Property Owners in Nairobi</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-white text-4xl font-bold">
              {inView && <CountUp end={98} duration={2.5} />}%
            </p>
            <p className="text-primary-200 text-sm">Satisfaction Rate</p>
          </div>
          <div className="text-center">
            <p className="text-white text-4xl font-bold">24/7</p>
            <p className="text-primary-200 text-sm">Support</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
