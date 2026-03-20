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

export default function Sidebar({ userType, currentPath = "", pendingMaintenance = 0, pendingRequests = 0 }: SidebarProps) {
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
      className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-primary-950 to-primary-900 text-white p-6 shadow-2xl z-50"
    >
      {/* Logo */}
      <div className="mb-10">
        <a href="/">
          <img
            src="/logo.png"
            alt="Zariva"
            className="h-16 w-auto object-contain"
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.href;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                isActive
                  ? "bg-gold-500 text-primary-950"
                  : "text-primary-200 hover:bg-primary-800"
              }`}
            >
              <Icon size={20} />
              {link.label}
              {link.badge && link.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="absolute bottom-6 left-6 right-6 space-y-2">
        <a
          href={settingsHref}
          className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all"
        >
          <Settings size={20} />
          Settings
        </a>
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-red-900/30 rounded-xl transition-all"
        >
          <LogOut size={20} />
          Logout
        </a>
      </div>
    </motion.aside>
  );
}
