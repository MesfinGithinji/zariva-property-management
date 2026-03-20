"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Zariva Africa Properties"
                width={120}
                height={40}
                className="h-12 w-auto"
                priority
              />
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-primary-700 font-medium transition">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-primary-700 font-medium transition">Benefits</a>
              <a href="#contact" className="text-gray-700 hover:text-primary-700 font-medium transition">Contact</a>
            </div>
            <div className="flex gap-3">
              <a
                href="/login"
                className="px-4 py-2 text-primary-700 font-semibold hover:text-primary-800 transition"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-primary-700 hover:bg-primary-800 text-white font-semibold rounded-lg transition shadow-lg shadow-primary-200"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <span className="px-4 py-2 bg-gold-100 text-gold-800 rounded-full text-sm font-semibold">
                  Your Trusted Real Estate Partner
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Property Management{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-gold-600">
                  Reimagined
                </span>
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
                <a
                  href="/landlord"
                  className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-xl shadow-primary-200 hover:shadow-2xl hover:shadow-primary-300 flex items-center justify-center"
                >
                  Landlord Portal
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition" />
                </a>
                <a
                  href="/tenant"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300 flex items-center justify-center"
                >
                  Tenant Portal
                </a>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-8 pt-4"
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-gold-400 border-2 border-white" />
                  ))}
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">500+</span> Properties Managed
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image/Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] rounded-3xl" />
                <div className="relative space-y-4">
                  {/* Dashboard Preview Cards */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/80 text-sm">Monthly Revenue</span>
                      <TrendingUp className="text-gold-400" size={20} />
                    </div>
                    <p className="text-3xl font-bold text-white">KES 2.4M</p>
                    <p className="text-green-300 text-sm mt-2">+12% from last month</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Building2 className="text-gold-400 mb-2" size={24} />
                      <p className="text-2xl font-bold text-white">24</p>
                      <p className="text-white/70 text-xs">Properties</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Users className="text-gold-400 mb-2" size={24} />
                      <p className="text-2xl font-bold text-white">156</p>
                      <p className="text-white/70 text-xs">Tenants</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{" "}
              <span className="text-primary-600">Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed for modern property management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-primary-600" size={32} />,
                title: "Real-time Analytics",
                description: "Track occupancy rates, revenue, and expenses with beautiful dashboards"
              },
              {
                icon: <Wrench className="text-primary-600" size={32} />,
                title: "Maintenance Management",
                description: "Submit, track, and resolve maintenance requests with photo attachments"
              },
              {
                icon: <CreditCard className="text-primary-600" size={32} />,
                title: "M-Pesa Integration",
                description: "Accept rent payments instantly via M-Pesa and bank transfers"
              },
              {
                icon: <Smartphone className="text-primary-600" size={32} />,
                title: "Mobile First",
                description: "Fully responsive design works perfectly on all devices"
              },
              {
                icon: <Shield className="text-primary-600" size={32} />,
                title: "Secure & Compliant",
                description: "Bank-level security with Kenyan rental law compliance"
              },
              {
                icon: <Users className="text-primary-600" size={32} />,
                title: "Tenant Portal",
                description: "Give tenants easy access to pay rent and request maintenance"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-xl transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white space-y-6"
            >
              <h2 className="text-4xl font-bold">
                Why Choose <span className="text-gold-400">Zariva?</span>
              </h2>
              <p className="text-xl text-primary-100">
                Built specifically for the Kenyan market with features landlords and tenants actually need.
              </p>

              <div className="space-y-4">
                {[
                  "Save 10+ hours per week on property management",
                  "Reduce late payments by 40% with automated reminders",
                  "Handle maintenance 3x faster with digital workflows",
                  "Access your data anywhere, anytime on any device"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-gold-400 flex-shrink-0 mt-1" size={24} />
                    <p className="text-lg text-primary-100">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gold-400 text-sm font-semibold mb-2">TRUSTED BY</p>
                  <p className="text-white text-5xl font-bold">500+</p>
                  <p className="text-primary-200 mt-2">Property Owners in Nairobi</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                  <div className="text-center">
                    <p className="text-white text-3xl font-bold">98%</p>
                    <p className="text-primary-200 text-sm">Satisfaction Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-3xl font-bold">24/7</p>
                    <p className="text-primary-200 text-sm">Support</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
            <h2 className="text-4xl font-bold text-gray-900">
              Ready to Transform Your{" "}
              <span className="text-primary-600">Property Management?</span>
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of property owners who have simplified their operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl transition-all shadow-xl shadow-primary-200 hover:shadow-2xl"
              >
                Start Free Trial
              </a>
              <a
                href="#contact"
                className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-700 font-semibold rounded-xl transition-all border-2 border-primary-200 hover:border-primary-300"
              >
                Schedule Demo
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <Image
                src="/logo.png"
                alt="Zariva Africa Properties"
                width={150}
                height={50}
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-gray-400">
                Your Trusted Real Estate Partner
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/landlord" className="hover:text-gold-400 transition">Landlord Portal</a></li>
                <li><a href="/tenant" className="hover:text-gold-400 transition">Tenant Portal</a></li>
                <li><a href="/admin" className="hover:text-gold-400 transition">Admin</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-400">
                <li>P.O. Box 15842, Nairobi, Kenya</li>
                <li>info@zariafrica.com</li>
                <li>+254 708 688 507</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2026 Zariva Africa Properties Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
