"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPin,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Eye,
} from "lucide-react";
import { landlordData } from "@/lib/mock-data";
import Sidebar from "@/components/Sidebar";

export default function PropertiesPage() {
  const { properties } = landlordData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/properties" />

      <div className="ml-72 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Properties</h1>
              <p className="text-lg text-gray-600">
                Manage and monitor all your properties
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all"
            >
              <Plus size={20} />
              Add Property
            </motion.button>
          </div>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-primary-300 rounded-xl font-semibold transition-all">
            <Filter size={20} />
            Filter
          </button>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Properties",
              value: properties.length,
              change: "+2 this month",
              positive: true,
            },
            {
              label: "Total Units",
              value: properties.reduce((sum, p) => sum + p.units, 0),
              change: `${properties.reduce((sum, p) => sum + p.occupiedUnits, 0)} occupied`,
              positive: true,
            },
            {
              label: "Avg Occupancy",
              value: `${(properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length).toFixed(1)}%`,
              change: "+3.2%",
              positive: true,
            },
            {
              label: "Monthly Revenue",
              value: `KES ${(properties.reduce((sum, p) => sum + p.monthlyIncome, 0) / 1000).toFixed(0)}K`,
              change: "+12.5%",
              positive: true,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className={`text-sm font-semibold ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => (
            <motion.a
              key={property.id}
              href={`/landlord/property/${property.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
            >
              {/* Property Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.image}
                  alt={property.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    property.status === "active"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}>
                    {property.status.toUpperCase()}
                  </span>
                </div>

                {/* Property Type */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-semibold">
                    {property.type}
                  </span>
                </div>

                {/* View Button */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-white rounded-full">
                    <Eye className="text-primary-700" size={20} />
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {property.name}
                </h3>
                <p className="text-gray-600 flex items-center gap-2 mb-4">
                  <MapPin size={16} />
                  {property.location}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Units</p>
                    <p className="font-semibold text-gray-900">
                      {property.occupiedUnits}/{property.units}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Occupancy</p>
                    <p className="font-semibold text-green-600">
                      {property.occupancyRate}%
                    </p>
                  </div>
                </div>

                {/* Revenue */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Monthly Income</span>
                    <span className="text-lg font-bold text-primary-700 flex items-center gap-1">
                      <TrendingUp size={16} />
                      KES {(property.monthlyIncome / 1000).toFixed(0)}K
                    </span>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
