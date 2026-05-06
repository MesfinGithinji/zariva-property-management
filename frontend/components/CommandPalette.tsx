"use client";

import { Command } from "cmdk";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { landlordData } from "@/lib/mock-data";
import {
  Building2, Users, Wrench, DollarSign, Settings,
  Home, CreditCard, FileText, BarChart3, Search,
  ArrowRight, MapPin, LogIn, UserPlus, Keyboard,
} from "lucide-react";

const ROUTES = [
  { group: "Landlord", label: "Dashboard",    href: "/landlord",             icon: BarChart3  },
  { group: "Landlord", label: "Properties",   href: "/landlord/properties",  icon: Building2  },
  { group: "Landlord", label: "Tenants",      href: "/landlord/tenants",     icon: Users      },
  { group: "Landlord", label: "Maintenance",  href: "/landlord/maintenance", icon: Wrench     },
  { group: "Landlord", label: "Financials",   href: "/landlord/finance",     icon: DollarSign },
  { group: "Landlord", label: "Settings",     href: "/landlord/settings",    icon: Settings   },
  { group: "Tenant",   label: "Dashboard",    href: "/tenant",               icon: Home       },
  { group: "Tenant",   label: "Payments",     href: "/tenant/payments",      icon: CreditCard },
  { group: "Tenant",   label: "Maintenance",  href: "/tenant/maintenance",   icon: Wrench     },
  { group: "Tenant",   label: "Documents",    href: "/tenant/documents",     icon: FileText   },
  { group: "Tenant",   label: "Settings",     href: "/tenant/settings",      icon: Settings   },
  { group: "Auth",     label: "Login",        href: "/login",                icon: LogIn      },
  { group: "Auth",     label: "Sign Up",      href: "/signup",               icon: UserPlus   },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const properties = landlordData.properties;
  const tenants = landlordData.tenants;

  // Keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    window.location.href = href;
  }

  const filteredRoutes = ROUTES.filter((r) =>
    r.label.toLowerCase().includes(query.toLowerCase()) ||
    r.group.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProperties = properties.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.location.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTenants = tenants.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.property.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = filteredRoutes.length > 0 || filteredProperties.length > 0 || filteredTenants.length > 0;

  return (
    <>
      {/* Trigger hint — shown in UI for discoverability */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-gray-200 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all shadow-sm"
      >
        <Search size={13} />
        <span>Search...</span>
        <kbd className="ml-2 flex items-center gap-0.5 font-mono text-[10px] text-gray-300">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.96, y: -16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101]"
            >
              <Command
                className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                shouldFilter={false}
              >
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
                  <Search size={17} className="text-gray-400 flex-shrink-0" />
                  <Command.Input
                    value={query}
                    onValueChange={setQuery}
                    placeholder="Search pages, properties, tenants…"
                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                    autoFocus
                  />
                  <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] text-gray-300 font-mono border border-gray-200 rounded px-1.5 py-0.5">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-[420px] overflow-y-auto p-2">
                  <Command.Empty className="py-12 text-center text-sm text-gray-400">
                    No results for <span className="font-semibold text-gray-600">"{query}"</span>
                  </Command.Empty>

                  {!hasResults && !query && (
                    <div className="py-8 text-center text-xs text-gray-400">
                      <Keyboard size={24} className="mx-auto mb-2 text-gray-300" />
                      Type to search pages, properties, or tenants
                    </div>
                  )}

                  {/* Pages / Routes */}
                  {filteredRoutes.length > 0 && (
                    <Command.Group
                      heading={<span className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Navigation</span>}
                    >
                      {filteredRoutes.map((route) => {
                        const Icon = route.icon;
                        return (
                          <Command.Item
                            key={route.href}
                            value={route.href}
                            onSelect={() => navigate(route.href)}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-900 data-[selected=true]:bg-primary-50 data-[selected=true]:text-primary-900 transition-colors"
                          >
                            <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-primary-100 group-data-[selected=true]:bg-primary-100 flex items-center justify-center flex-shrink-0 transition-colors">
                              <Icon size={14} className="text-gray-500 group-hover:text-primary-700 group-data-[selected=true]:text-primary-700" />
                            </span>
                            <span className="flex-1 font-medium">{route.label}</span>
                            <span className="text-[10px] text-gray-300 group-hover:text-gray-400">{route.group}</span>
                            <ArrowRight size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 group-data-[selected=true]:opacity-100 transition-opacity" />
                          </Command.Item>
                        );
                      })}
                    </Command.Group>
                  )}

                  {/* Properties */}
                  {filteredProperties.length > 0 && (
                    <Command.Group
                      heading={<span className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Properties</span>}
                    >
                      {filteredProperties.map((property) => (
                        <Command.Item
                          key={property.id}
                          value={`property-${property.id}`}
                          onSelect={() => navigate(`/landlord/property/${property.id}`)}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-900 data-[selected=true]:bg-primary-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={property.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <span className="flex-1">
                            <span className="font-medium block">{property.name}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <MapPin size={10} />{property.location}
                            </span>
                          </span>
                          <span className="text-xs text-gray-400 num">{property.occupancyRate}% occ.</span>
                          <ArrowRight size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {/* Tenants */}
                  {filteredTenants.length > 0 && (
                    <Command.Group
                      heading={<span className="px-2 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tenants</span>}
                    >
                      {filteredTenants.map((tenant) => (
                        <Command.Item
                          key={tenant.id}
                          value={`tenant-${tenant.id}`}
                          onSelect={() => navigate("/landlord/tenants")}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-900 data-[selected=true]:bg-primary-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-primary-100 flex items-center justify-center">
                            {tenant.avatar ? (
                              <img src={tenant.avatar} alt={tenant.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-primary-700 text-[10px] font-bold">
                                {tenant.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </span>
                            )}
                          </div>
                          <span className="flex-1">
                            <span className="font-medium block">{tenant.name}</span>
                            <span className="text-xs text-gray-400">{tenant.property} · {tenant.unit}</span>
                          </span>
                          <ArrowRight size={13} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}
                </Command.List>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-gray-100 flex items-center gap-4 text-[10px] text-gray-300">
                  <span className="flex items-center gap-1"><kbd className="font-mono border border-gray-200 rounded px-1">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1"><kbd className="font-mono border border-gray-200 rounded px-1">↵</kbd> open</span>
                  <span className="flex items-center gap-1"><kbd className="font-mono border border-gray-200 rounded px-1">ESC</kbd> close</span>
                </div>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
