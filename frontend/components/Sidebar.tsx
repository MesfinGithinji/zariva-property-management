"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  Users,
  Wrench,
  DollarSign,
  Settings,
  LogOut,
  Home,
  CreditCard,
  FileText,
} from "lucide-react";

interface SidebarProps {
  userType: "landlord" | "tenant";
  currentPath?: string;
  pendingMaintenance?: number;
  pendingRequests?: number;
}

export default function Sidebar({
  userType,
  currentPath = "",
  pendingMaintenance = 0,
  pendingRequests = 0,
}: SidebarProps) {
  const landlordLinks = [
    { href: "/landlord", icon: BarChart3, label: "Dashboard" },
    { href: "/landlord/properties", icon: Building2, label: "Properties" },
    { href: "/landlord/tenants", icon: Users, label: "Tenants" },
    { href: "/landlord/maintenance", icon: Wrench, label: "Maintenance", badge: pendingMaintenance },
    { href: "/landlord/finance", icon: DollarSign, label: "Financials" },
  ];

  const tenantLinks = [
    { href: "/tenant", icon: Home, label: "Dashboard" },
    { href: "/tenant/payments", icon: CreditCard, label: "Payments" },
    { href: "/tenant/maintenance", icon: Wrench, label: "Maintenance", badge: pendingRequests },
    { href: "/tenant/documents", icon: FileText, label: "Documents" },
  ];

  const links = userType === "landlord" ? landlordLinks : tenantLinks;
  const settingsHref = userType === "landlord" ? "/landlord/settings" : "/tenant/settings";

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-primary-950 to-[#0f2419] text-white p-6 shadow-2xl z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="mb-10 flex-shrink-0">
        <a href="/">
          <img
            src="/logo_transparent.png"
            alt="Zariva"
            className="h-24 w-auto object-contain"
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors group"
            >
              {/* Animated active pill via layout */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-gold-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                />
              )}

              {/* Hover highlight (only when not active) */}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl bg-primary-800/0 group-hover:bg-primary-800/60 transition-colors duration-200" />
              )}

              {/* Content — sits above the pill */}
              <span className={`relative z-10 flex items-center gap-3 w-full ${isActive ? "text-primary-950" : "text-primary-200"}`}>
                <Icon size={20} />
                {link.label}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive ? "bg-primary-950/20 text-primary-950" : "bg-red-500 text-white"
                  }`}>
                    {link.badge}
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 flex-shrink-0 pt-4 border-t border-primary-800/50">
        {/* Settings — also gets active pill treatment */}
        {(() => {
          const isSettingsActive = currentPath === settingsHref;
          return (
            <a
              href={settingsHref}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold group"
            >
              {isSettingsActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-gold-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                />
              )}
              {!isSettingsActive && (
                <span className="absolute inset-0 rounded-xl bg-primary-800/0 group-hover:bg-primary-800/60 transition-colors duration-200" />
              )}
              <span className={`relative z-10 flex items-center gap-3 ${isSettingsActive ? "text-primary-950" : "text-primary-200"}`}>
                <Settings size={20} />
                Settings
              </span>
            </a>
          );
        })()}

        <a
          href="/"
          className="relative flex items-center gap-3 px-4 py-3 text-primary-300 hover:text-red-300 rounded-xl transition-colors group"
        >
          <span className="absolute inset-0 rounded-xl bg-red-900/0 group-hover:bg-red-900/20 transition-colors duration-200" />
          <span className="relative z-10 flex items-center gap-3">
            <LogOut size={20} />
            Logout
          </span>
        </a>
      </div>
    </motion.aside>
  );
}
