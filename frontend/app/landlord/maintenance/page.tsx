"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  AlertCircle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Building2,
} from "lucide-react";
import { landlordData } from "@/lib/mock-data";
import { format } from "date-fns";
import Sidebar from "@/components/Sidebar";

export default function MaintenancePage() {
  const { maintenanceRequests, overview } = landlordData;

  const stats = [
    {
      label: "Pending",
      value: maintenanceRequests.filter(r => r.status === "pending").length,
      color: "yellow",
      icon: Clock,
    },
    {
      label: "In Progress",
      value: maintenanceRequests.filter(r => r.status === "in_progress").length,
      color: "blue",
      icon: Wrench,
    },
    {
      label: "Completed",
      value: maintenanceRequests.filter(r => r.status === "completed").length,
      color: "green",
      icon: CheckCircle2,
    },
    {
      label: "High Priority",
      value: maintenanceRequests.filter(r => r.priority === "high").length,
      color: "red",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar userType="landlord" currentPath="/landlord/maintenance" pendingMaintenance={overview.pendingMaintenance} />

      <div className="ml-72 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Maintenance Requests</h1>
          <p className="text-lg text-gray-600">
            Track and manage all maintenance requests across your properties
          </p>
        </motion.div>

        {/* Search & Filter */}
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
              placeholder="Search requests..."
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 hover:border-primary-300 rounded-xl font-semibold transition-all">
            <Filter size={20} />
            Filter
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap: { [key: string]: { bg: string; text: string } } = {
              yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
              blue: { bg: "bg-blue-100", text: "text-blue-600" },
              green: { bg: "bg-green-100", text: "text-green-600" },
              red: { bg: "bg-red-100", text: "text-red-600" },
            };
            const colorClasses = colorMap[stat.color];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className={`inline-flex p-3 ${colorClasses.bg} rounded-xl mb-4`}>
                  <Icon className={colorClasses.text} size={24} />
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Maintenance Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Requests</h2>
          </div>

          <div className="divide-y divide-gray-100">
            {maintenanceRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className={`p-4 rounded-xl ${
                    request.priority === "high" ? "bg-red-100" :
                    request.priority === "medium" ? "bg-yellow-100" :
                    "bg-blue-100"
                  }`}>
                    <Wrench className={
                      request.priority === "high" ? "text-red-600" :
                      request.priority === "medium" ? "text-yellow-600" :
                      "text-blue-600"
                    } size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          {request.issue}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.status === "completed" ? "bg-green-100 text-green-700" :
                        request.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {request.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 size={16} />
                        <div>
                          <p className="text-xs text-gray-500">Property</p>
                          <p className="font-semibold text-gray-900">{request.property}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <div>
                          <p className="text-xs text-gray-500">Tenant</p>
                          <p className="font-semibold text-gray-900">{request.tenant}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <div>
                          <p className="text-xs text-gray-500">Submitted</p>
                          <p className="font-semibold text-gray-900">
                            {format(request.date, "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle size={16} />
                        <div>
                          <p className="text-xs text-gray-500">Priority</p>
                          <p className={`font-semibold ${
                            request.priority === "high" ? "text-red-600" :
                            request.priority === "medium" ? "text-yellow-600" :
                            "text-blue-600"
                          }`}>
                            {request.priority.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">
                        Assign Contractor
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-all">
                        Update Status
                      </button>
                      <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-all">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
