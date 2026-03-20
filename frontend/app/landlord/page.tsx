"use client";

import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Users,
  Wrench,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Home,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  MoreVertical,
  AlertCircle,
  CheckCircle2,
  Clock,
  MapPin,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { landlordData } from "@/lib/mock-data";
import { format } from "date-fns";

export default function LandlordDashboard() {
  const { overview, properties, revenueData, recentActivity, maintenanceRequests } = landlordData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-primary-950 to-primary-900 text-white p-6 shadow-2xl z-50"
      >
        {/* Logo */}
        <div className="mb-10">
          <img
            src="/logo.png"
            alt="Zariva"
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <a href="/landlord" className="flex items-center gap-3 px-4 py-3 bg-gold-500 text-primary-950 rounded-xl font-semibold transition-all">
            <BarChart3 size={20} />
            Dashboard
          </a>
          <a href="/landlord/properties" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all">
            <Building2 size={20} />
            Properties
          </a>
          <a href="/landlord/tenants" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all">
            <Users size={20} />
            Tenants
          </a>
          <a href="/landlord/maintenance" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all">
            <Wrench size={20} />
            Maintenance
            {overview.pendingMaintenance > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {overview.pendingMaintenance}
              </span>
            )}
          </a>
          <a href="/landlord/finance" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all">
            <DollarSign size={20} />
            Financials
          </a>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <a href="/landlord/settings" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-primary-800 rounded-xl transition-all">
            <Settings size={20} />
            Settings
          </a>
          <a href="/" className="flex items-center gap-3 px-4 py-3 text-primary-200 hover:bg-red-900/30 rounded-xl transition-all">
            <LogOut size={20} />
            Logout
          </a>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, Matty!</h1>
            <p className="text-gray-600">Here's what's happening with your properties today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all relative">
              <Bell size={20} className="text-gray-700" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <Plus size={20} />
              Add Property
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
                  <Building2 className="text-primary-700" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <ArrowUpRight size={16} />
                  8%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Properties</h3>
              <p className="text-3xl font-bold text-gray-900">{overview.totalProperties}</p>
              <p className="text-xs text-gray-500 mt-2">{overview.totalUnits} units total</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl">
                  <DollarSign className="text-gold-700" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <ArrowUpRight size={16} />
                  {overview.revenueGrowth}%
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-gray-900">
                KES {(overview.monthlyRevenue / 1000000).toFixed(2)}M
              </p>
              <p className="text-xs text-gray-500 mt-2">+KES 300K from last month</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <Users className="text-blue-700" size={24} />
                </div>
                <span className="flex items-center text-green-600 text-sm font-semibold">
                  <ArrowUpRight size={16} />
                  {overview.newTenantsThisMonth}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Active Tenants</h3>
              <p className="text-3xl font-bold text-gray-900">{overview.activeTenants}</p>
              <p className="text-xs text-gray-500 mt-2">Occupancy: {overview.occupancyRate}%</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <Wrench className="text-red-700" size={24} />
                </div>
                {overview.pendingMaintenance > 0 && (
                  <span className="flex items-center text-red-600 text-sm font-semibold">
                    <AlertCircle size={16} />
                  </span>
                )}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Requests</h3>
              <p className="text-3xl font-bold text-gray-900">{overview.pendingMaintenance}</p>
              <p className="text-xs text-gray-500 mt-2">Requires attention</p>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Revenue Overview</h3>
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option>Last 6 months</option>
                <option>Last 12 months</option>
                <option>This year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4332" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1B4332" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1B4332"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Occupancy Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Property Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={properties.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#999" style={{ fontSize: '11px' }} angle={-15} textAnchor="end" height={80} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="occupancyRate" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Properties Grid & Activity */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Properties List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Your Properties</h3>
                <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
                  View All →
                </button>
              </div>
              <div className="space-y-4">
                {properties.slice(0, 3).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="group flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-gold-300 hover:shadow-lg transition-all"
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{property.name}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mb-2">
                        <MapPin size={14} />
                        {property.location}
                      </p>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-600">{property.occupiedUnits}/{property.units} units</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {property.occupancyRate}% occupied
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Monthly</p>
                      <p className="text-lg font-bold text-primary-700">
                        KES {(property.monthlyIncome / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id} className="flex gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'maintenance' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {activity.type === 'payment' && <DollarSign size={18} className="text-green-600" />}
                    {activity.type === 'maintenance' && <Wrench size={18} className="text-red-600" />}
                    {activity.type === 'lease_renewal' && <Clock size={18} className="text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.tenant}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      {activity.type === 'payment' && `Paid KES ${activity.amount?.toLocaleString()}`}
                      {activity.type === 'maintenance' && activity.description}
                      {activity.type === 'lease_renewal' && 'Lease renewal pending'}
                    </p>
                    <p className="text-xs text-gray-500">{format(activity.date, 'MMM dd, h:mm a')}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
