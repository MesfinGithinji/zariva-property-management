"use client";

import { motion } from "framer-motion";
import {
  User, Mail, Phone, Building2, Lock, Bell,
  Shield, CreditCard, Camera, CheckCircle2, ChevronRight,
} from "lucide-react";
import { landlordData } from "@/lib/mock-data";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const tabs = ["Profile", "Notifications", "Security", "Billing"];

export default function LandlordSettingsPage() {
  const { profile, overview } = landlordData;
  const [activeTab, setActiveTab] = useState("Profile");
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    company: profile.company,
    location: profile.location,
  });
  const [notifications, setNotifications] = useState({
    paymentReceived: true,
    maintenanceRequests: true,
    leaseExpiry: true,
    newTenant: true,
    weeklyReport: false,
    marketingUpdates: false,
  });

  function handleSave() {
    toast.success("Settings saved successfully!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar
        userType="landlord"
        currentPath="/landlord/settings"
        pendingMaintenance={overview.pendingMaintenance}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mb-8"
        >
          <p className="text-xs uppercase tracking-widest text-gold-600 font-semibold mb-1">
            Account Settings
          </p>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            <span className="text-gold-shimmer">Settings</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account preferences and profile</p>
        </motion.div>

        <div className="flex gap-8">
          {/* Sidebar tabs */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-52 flex-shrink-0"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {tabs.map((tab) => {
                const icons: Record<string, any> = { Profile: User, Notifications: Bell, Security: Shield, Billing: CreditCard };
                const Icon = icons[tab];
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all text-left border-b border-gray-50 last:border-0 ${
                      activeTab === tab
                        ? "bg-primary-950 text-gold-400"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                    {tab}
                    {activeTab === tab && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Tab content */}
          <div className="flex-1 min-w-0">
            {activeTab === "Profile" && (
              <FadeCard delay={0.3} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                      <span className="text-primary-700 font-bold text-2xl">
                        {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                    <button
                      onClick={() => toast.info("Photo upload coming soon!")}
                      className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-950 rounded-full flex items-center justify-center border-2 border-white hover:bg-primary-900 transition-colors"
                    >
                      <Camera size={12} className="text-gold-400" />
                    </button>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{profile.name}</p>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                    <button
                      onClick={() => toast.info("Photo upload coming soon!")}
                      className="text-xs text-primary-600 hover:text-gold-600 font-medium mt-1 transition-colors"
                    >
                      Change photo
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: "name", label: "Full Name", icon: User, type: "text" },
                    { key: "email", label: "Email Address", icon: Mail, type: "email" },
                    { key: "phone", label: "Phone Number", icon: Phone, type: "tel" },
                    { key: "company", label: "Company", icon: Building2, type: "text" },
                  ].map(({ key, label, icon: Icon, type }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        {label}
                      </label>
                      <div className="relative">
                        <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type={type}
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm border border-gold-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </FadeCard>
            )}

            {activeTab === "Notifications" && (
              <FadeCard delay={0.3} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Choose what you want to be notified about</p>

                <div className="space-y-1">
                  {[
                    { key: "paymentReceived", label: "Payment Received", desc: "Get notified when a tenant makes a payment" },
                    { key: "maintenanceRequests", label: "Maintenance Requests", desc: "New or updated maintenance requests" },
                    { key: "leaseExpiry", label: "Lease Expiry Reminders", desc: "30, 60, and 90-day reminders before lease ends" },
                    { key: "newTenant", label: "New Tenant Onboarded", desc: "When a new tenant is added to a property" },
                    { key: "weeklyReport", label: "Weekly Summary Report", desc: "A weekly email digest of all activity" },
                    { key: "marketingUpdates", label: "Product Updates", desc: "News and updates from Zariva" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] });
                          toast.success(`${label} ${!notifications[key as keyof typeof notifications] ? "enabled" : "disabled"}`);
                        }}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                          notifications[key as keyof typeof notifications] ? "bg-primary-950" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                            notifications[key as keyof typeof notifications] ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm border border-gold-500/20"
                  >
                    Save Preferences
                  </button>
                </div>
              </FadeCard>
            )}

            {activeTab === "Security" && (
              <FadeCard delay={0.3} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  {/* Change password */}
                  <div className="pb-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Change Password</h3>
                    <div className="space-y-3">
                      {["Current Password", "New Password", "Confirm New Password"].map((label) => (
                        <div key={label}>
                          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => toast.success("Password updated!")}
                        className="mt-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm border border-gold-500/20"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div className="pb-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">Two-Factor Authentication</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => toast.info("2FA setup coming soon!")}
                        className="px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-xl text-xs hover:bg-emerald-100 transition-all border border-emerald-200"
                      >
                        Enable 2FA
                      </button>
                    </div>
                  </div>

                  {/* Active sessions */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Active Sessions</h3>
                    {[
                      { device: "Chrome on macOS", location: "Nairobi, Kenya", time: "Now (current session)", current: true },
                      { device: "Safari on iPhone 15", location: "Nairobi, Kenya", time: "2 hours ago", current: false },
                    ].map((session) => (
                      <div key={session.device} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                            {session.device}
                            {session.current && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                Current
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">{session.location} · {session.time}</p>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => toast.success("Session revoked")}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </FadeCard>
            )}

            {activeTab === "Billing" && (
              <FadeCard delay={0.3} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing & Subscription</h2>
                <p className="text-sm text-gray-500 mb-6">Manage your subscription and payment methods</p>

                {/* Current plan */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-950 to-primary-900 text-white mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gold-400 text-xs font-semibold uppercase tracking-wide mb-1">Current Plan</p>
                      <p className="text-2xl font-bold">Professional</p>
                      <p className="text-primary-200 text-sm mt-0.5">Up to 50 units · Full analytics · Priority support</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gold-400 num">KES 4,999</p>
                      <p className="text-primary-300 text-xs">/month</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-xs text-primary-200">Renews on Apr 1, 2026</span>
                    </div>
                    <button
                      onClick={() => toast.info("Plan management coming soon!")}
                      className="text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors"
                    >
                      Manage Plan →
                    </button>
                  </div>
                </div>

                {/* Payment method */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Payment Method</h3>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-10 h-7 bg-primary-950 rounded flex items-center justify-center">
                      <CreditCard size={14} className="text-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Visa ending in 4242</p>
                      <p className="text-xs text-gray-400">Expires 08/2027</p>
                    </div>
                    <button
                      onClick={() => toast.info("Card management coming soon!")}
                      className="ml-auto text-xs text-primary-600 hover:text-gold-600 font-medium transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </FadeCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
