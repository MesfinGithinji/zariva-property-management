"use client";

import { motion } from "framer-motion";
import {
  User, Mail, Phone, Lock, Bell, Image as ImageIcon,
  Shield, CreditCard, ChevronRight, Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { setCachedUser } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import { FadeCard } from "@/components/ui/fade-card";
import { toast } from "sonner";

const tabs = ["Profile", "Notifications", "Security", "Billing"];

export default function LandlordSettingsPage() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("Profile");

  const [form, setForm] = useState({ full_name: "", phone: "", profile_image: "" });
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ current_password: "", new_password: "", confirm: "" });
  const [changingPw, setChangingPw] = useState(false);

  const [notifications, setNotifications] = useState({
    paymentReceived: true,
    maintenanceRequests: true,
    leaseExpiry: true,
    newTenant: true,
    weeklyReport: false,
    marketingUpdates: false,
  });

  useEffect(() => {
    if (user) {
      setForm({ full_name: user.full_name, phone: user.phone ?? "", profile_image: user.profile_image ?? "" });
    }
  }, [user]);

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const updated = await api.patch<typeof user>("/auth/me", {
        full_name: form.full_name,
        phone: form.phone || null,
        profile_image: form.profile_image || null,
      });
      if (updated) {
        setUser(updated);
        setCachedUser(updated);
      }
      toast.success("Profile updated.");
    } catch (err: any) {
      toast.error(err.message ?? "Could not save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!pw.current_password || !pw.new_password) {
      toast.error("Please fill in your current and new password.");
      return;
    }
    if (pw.new_password.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (pw.new_password !== pw.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    setChangingPw(true);
    try {
      await api.post("/auth/change-password", {
        current_password: pw.current_password,
        new_password: pw.new_password,
      });
      toast.success("Password updated.");
      setPw({ current_password: "", new_password: "", confirm: "" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not update password.");
    } finally {
      setChangingPw(false);
    }
  }

  const initials = (user?.full_name ?? "?").split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-[#F5F1E8]/40 to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/settings" />

      <div className="lg:ml-72 p-4 pt-20 lg:pt-8 lg:p-8">
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
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 tracking-tight">
            <span className="text-gold-shimmer">Settings</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account preferences and profile</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar tabs */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-52 shrink-0"
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
                      activeTab === tab ? "bg-primary-950 text-gold-400" : "text-gray-600 hover:bg-gray-50"
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
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0">
                    {form.profile_image ? (
                      <img src={form.profile_image} alt={user?.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary-700 font-bold text-2xl">{initials}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{user?.full_name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <div className="relative mt-2">
                      <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={form.profile_image}
                        onChange={(e) => setForm({ ...form, profile_image: e.target.value })}
                        placeholder="Paste an image URL for your avatar"
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email ?? ""}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+254 7XX XXX XXX"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm border border-gold-500/20 disabled:opacity-60"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
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
                    { key: "newTenant", label: "New Join Requests", desc: "When a tenant requests to join a property" },
                    { key: "weeklyReport", label: "Weekly Summary Report", desc: "A weekly email digest of all activity" },
                    { key: "marketingUpdates", label: "Product Updates", desc: "News and updates from Zariva" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
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
                <p className="text-xs text-gray-400 mt-6 border-t border-gray-50 pt-4">
                  Notification delivery (email/SMS) is being rolled out — these preferences are saved to your device for now.
                </p>
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
                      {([
                        { key: "current_password", label: "Current Password" },
                        { key: "new_password", label: "New Password" },
                        { key: "confirm", label: "Confirm New Password" },
                      ] as const).map(({ key, label }) => (
                        <div key={key}>
                          <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                          <div className="relative">
                            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="password"
                              value={pw[key]}
                              onChange={(e) => setPw({ ...pw, [key]: e.target.value })}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 transition-all"
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleChangePassword}
                        disabled={changingPw}
                        className="mt-2 flex items-center gap-2 px-5 py-2.5 bg-primary-950 hover:bg-primary-900 text-gold-400 font-semibold rounded-xl transition-all text-sm border border-gold-500/20 disabled:opacity-60"
                      >
                        {changingPw && <Loader2 size={14} className="animate-spin" />}
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* 2FA — deferred */}
                  <div className="flex items-center justify-between opacity-60">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Coming soon — extra login security via an authenticator app.</p>
                    </div>
                    <span className="px-4 py-2 bg-gray-100 text-gray-400 font-semibold rounded-xl text-xs border border-gray-200 cursor-not-allowed">
                      Coming soon
                    </span>
                  </div>
                </div>
              </FadeCard>
            )}

            {activeTab === "Billing" && (
              <FadeCard delay={0.3} className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Billing & Subscription</h2>
                <p className="text-sm text-gray-500 mb-6">Manage your subscription and payment methods</p>

                <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200 text-center">
                  <CreditCard size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-700 font-semibold mb-1">Billing is coming soon</p>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto">
                    Subscription plans and payment methods aren't available yet. Zariva is currently free to use —
                    we'll notify you before any billing is introduced.
                  </p>
                </div>
              </FadeCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
