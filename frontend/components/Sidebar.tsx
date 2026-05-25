"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ClipboardList,
  Shield,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/lib/auth";

type NavLink = { href: string; icon: LucideIcon; label: string; badge?: number };

interface SidebarProps {
  userType: "landlord" | "tenant";
  currentPath?: string;
  pendingMaintenance?: number;
  pendingRequests?: number;
}

function SidebarContent({
  userType,
  currentPath = "",
  pendingMaintenance = 0,
  pendingRequests = 0,
  onNavClick,
}: SidebarProps & { onNavClick?: () => void }) {
  const router = useRouter();

  const landlordLinks: NavLink[] = [
    { href: "/landlord", icon: BarChart3, label: "Dashboard" },
    { href: "/landlord/properties", icon: Building2, label: "Properties" },
    { href: "/landlord/tenants", icon: Users, label: "Tenants" },
    { href: "/landlord/maintenance", icon: Wrench, label: "Maintenance", badge: pendingMaintenance },
    { href: "/landlord/finance", icon: DollarSign, label: "Financials" },
    { href: "/landlord/requests", icon: ClipboardList, label: "Consent Requests", badge: pendingRequests },
  ];

  const tenantLinks: NavLink[] = [
    { href: "/tenant", icon: Home, label: "Dashboard" },
    { href: "/tenant/payments", icon: CreditCard, label: "Payments" },
    { href: "/tenant/maintenance", icon: Wrench, label: "Maintenance" },
    { href: "/tenant/documents", icon: FileText, label: "Documents" },
    { href: "/tenant/requests", icon: ClipboardList, label: "My Requests" },
    { href: "/privacy", icon: Shield, label: "Privacy Notice" },
  ];

  const links = userType === "landlord" ? landlordLinks : tenantLinks;
  const settingsHref = userType === "landlord" ? "/landlord/settings" : "/tenant/settings";

  function handleNav(href: string) {
    onNavClick?.();
    router.push(href);
  }

  function handleLogout() {
    onNavClick?.();
    clearAuth();
    router.push("/login");
  }

  return (
    <div className="flex flex-col h-full p-6 shrink-0">
      {/* Logo */}
      <div className="mb-8 shrink-0">
        <a href="/" onClick={() => onNavClick?.()} className="block">
          <img src="/logo_transparent.png" alt="Zariva" className="h-14 w-auto object-contain" />
        </a>
        <p className="text-primary-400 text-xs mt-2 font-medium tracking-widest uppercase">
          {userType === "landlord" ? "Landlord Portal" : "Tenant Portal"}
        </p>
      </div>

      {/* Nav */}
      <nav className="space-y-1 flex-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = currentPath === link.href ||
            (link.href !== "/landlord" && link.href !== "/tenant" && currentPath.startsWith(link.href));

          return (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="relative flex items-center w-full rounded-xl py-3 px-4 group min-h-11 text-left"
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 bg-gold-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 380, damping: 36 }}
                />
              )}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl bg-primary-800/0 group-hover:bg-primary-800/60 transition-colors duration-200" />
              )}
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
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-1 shrink-0 pt-4 border-t border-primary-800/50">
        <button
          onClick={() => handleNav(settingsHref)}
          className="relative flex items-center w-full rounded-xl py-3 px-4 group min-h-11 text-left"
        >
          <span className="absolute inset-0 rounded-xl bg-primary-800/0 group-hover:bg-primary-800/60 transition-colors duration-200" />
          <span className="relative z-10 flex items-center gap-3 text-primary-200">
            <Settings size={20} />
            Settings
          </span>
        </button>
        <button
          onClick={handleLogout}
          className="relative flex items-center w-full rounded-xl py-3 px-4 group min-h-11 text-left"
        >
          <span className="absolute inset-0 rounded-xl bg-red-900/0 group-hover:bg-red-900/40 transition-colors duration-200" />
          <span className="relative z-10 flex items-center gap-3 text-primary-300 group-hover:text-red-300 transition-colors">
            <LogOut size={20} />
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex fixed left-0 top-0 h-full w-72 bg-linear-to-b from-primary-950 to-[#0f2419] text-white shadow-2xl z-50 flex-col"
      >
        <SidebarContent {...props} />
      </motion.aside>

      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 min-w-11 min-h-11 flex items-center justify-center rounded-xl bg-primary-950 text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-linear-to-b from-primary-950 to-[#0f2419] text-white shadow-2xl z-50 overflow-y-auto"
            >
              {/* Close button */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 min-w-11 min-h-11 flex items-center justify-center rounded-xl text-primary-300 hover:text-white hover:bg-primary-800/60 transition-colors"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <SidebarContent {...props} onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
