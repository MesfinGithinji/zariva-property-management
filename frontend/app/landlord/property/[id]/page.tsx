"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowLeft,
  Home,
  Settings,
  Wrench,
  Shield,
  Zap,
  Droplet,
  Car,
  Move,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { propertyDetailData } from "@/lib/mock-data";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Sidebar from "@/components/Sidebar";

export default function PropertyDetail() {
  const property = propertyDetailData;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const amenityIcons: { [key: string]: any } = {
    shield: Shield,
    zap: Zap,
    droplet: Droplet,
    car: Car,
    move: Move,
    camera: Camera,
  };

  // Color mappings for stat cards (fix for Tailwind dynamic classes)
  const colorClasses: { [key: string]: { bg: string; bgIcon: string; text: string } } = {
    blue: { bg: "bg-blue-100", bgIcon: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", bgIcon: "bg-green-100", text: "text-green-600" },
    gold: { bg: "bg-gold-100", bgIcon: "bg-gold-100", text: "text-gold-600" },
    purple: { bg: "bg-purple-100", bgIcon: "bg-purple-100", text: "text-purple-600" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/properties" />

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Back Button */}
        <motion.a
          href="/landlord"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
          className="inline-flex items-center gap-2 mb-6 text-primary-700 hover:text-primary-900 font-semibold transition-all"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </motion.a>

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{property.name}</h1>
              <p className="text-lg text-gray-600 flex items-center gap-2">
                <MapPin size={20} className="text-primary-600" />
                {property.address}
              </p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 shadow-lg transition-all"
              >
                <Settings size={20} className="inline mr-2" />
                Manage
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all"
              >
                View Report
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 relative bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="relative h-96">
            <img
              src={property.images[currentImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Image Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full transition-all"
            >
              <ChevronRight className="text-white" size={24} />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Property Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-gold-500 text-primary-950 font-bold rounded-lg shadow-lg">
                {property.type}
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                  idx === currentImageIndex ? 'ring-4 ring-primary-500 scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Units",
              value: property.totalUnits,
              icon: Building2,
              color: "blue",
              subtext: `${property.occupiedUnits} occupied`,
            },
            {
              label: "Occupancy Rate",
              value: `${property.occupancyRate}%`,
              icon: TrendingUp,
              color: "green",
              subtext: `${property.vacantUnits} vacant`,
            },
            {
              label: "Monthly Income",
              value: `KES ${(property.monthlyIncome / 1000).toFixed(0)}K`,
              icon: DollarSign,
              color: "gold",
              subtext: "Expected revenue",
            },
            {
              label: "Property Value",
              value: `KES ${(property.propertyValue / 1000000).toFixed(1)}M`,
              icon: Home,
              color: "purple",
              subtext: `Built in ${property.yearBuilt}`,
            },
          ].map((stat, index) => {
            const colors = colorClasses[stat.color];
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${colors.bg} rounded-bl-full opacity-30 group-hover:opacity-50 transition-opacity`}></div>
              <div className="relative z-10">
                <div className={`inline-flex p-3 ${colors.bgIcon} rounded-xl mb-4`}>
                  <stat.icon className={colors.text} size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.subtext}</p>
              </div>
            </motion.div>
          );
        })}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Collection</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={property.revenueHistory}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="collected"
                  stroke="#1B4332"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCollected)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Expenses Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Expenses</h3>
            <div className="space-y-4">
              {property.expenses.slice(0, 5).map((expense, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category} • {format(expense.date, 'MMM dd, yyyy')}</p>
                  </div>
                  <p className="text-lg font-bold text-red-600">-KES {expense.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Amenities Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {property.amenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity.icon];
              return (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-primary-50 to-gold-50 rounded-xl cursor-pointer"
                >
                  <div className="p-3 bg-white rounded-full mb-3 shadow-md">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 text-center">{amenity.name}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Units Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Units Overview</h3>
            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg">
              {property.occupiedUnits}/{property.totalUnits} Occupied
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Unit</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Floor</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Rent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tenant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Lease Ends</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {property.units.map((unit, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + idx * 0.05 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">{unit.id}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">{unit.type}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">Floor {unit.floor}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">KES {unit.rent.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">{unit.tenant || '-'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">{unit.leaseEnd ? format(unit.leaseEnd, 'MMM dd, yyyy') : '-'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        unit.status === 'occupied'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Maintenance History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Maintenance History</h3>
          <div className="space-y-4">
            {property.maintenanceHistory.map((maintenance, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all">
                <div className={`p-3 rounded-lg ${
                  maintenance.priority === 'high' ? 'bg-red-100' :
                  maintenance.priority === 'medium' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  <Wrench className={
                    maintenance.priority === 'high' ? 'text-red-600' :
                    maintenance.priority === 'medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  } size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{maintenance.issue}</h4>
                      <p className="text-sm text-gray-600">Unit {maintenance.unit} • {maintenance.tenant}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      maintenance.status === 'completed' ? 'bg-green-100 text-green-700' :
                      maintenance.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {maintenance.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(maintenance.date, 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} />
                      KES {maintenance.cost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Property Manager Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl shadow-lg text-white"
        >
          <h3 className="text-xl font-bold mb-4">Property Manager</h3>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gold-400 rounded-full flex items-center justify-center text-primary-950 font-bold text-2xl">
              {property.manager.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">{property.manager.name}</p>
              <div className="flex items-center gap-6 mt-2 text-primary-200">
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  {property.manager.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Mail size={16} />
                  {property.manager.email}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-primary-950 font-bold rounded-xl transition-all"
            >
              Contact
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
