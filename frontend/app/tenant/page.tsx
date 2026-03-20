"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Wrench,
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Send,
  Calendar,
  MapPin,
  Phone,
  Zap,
  Droplet,
  Wifi,
  Upload,
  X,
} from "lucide-react";
import { tenantData } from "@/lib/mock-data";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function TenantDashboard() {
  const { profile, currentLease, rentStatus, paymentHistory, maintenanceRequests, utilities, notifications } = tenantData;
  const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({
    issue: "",
    description: "",
    category: "general",
    priority: "medium",
  });

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const daysUntilLeaseEnd = differenceInDays(currentLease.leaseEnd, new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar
        userType="tenant"
        currentPath="/tenant"
        pendingRequests={maintenanceRequests.filter(r => r.status !== 'completed').length}
      />

      {/* Main Content */}
      <div className="ml-72 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {profile.name.split(' ')[0]}!</h1>
            <p className="text-gray-600">Managing your home at {currentLease.property}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all relative">
              <Bell size={20} className="text-gray-700" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {unreadNotifications}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Rent Status Alert */}
        {rentStatus.status === 'overdue' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-200 rounded-full">
                <AlertCircle className="text-red-700" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">Rent Payment Overdue</h3>
                <p className="text-red-700 mb-3">
                  Your rent payment was due on {format(rentStatus.dueDate, 'MMMM dd, yyyy')} ({rentStatus.daysOverdue} days ago).
                  Please make payment of KES {rentStatus.balance.toLocaleString()} immediately to avoid penalties.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                >
                  Pay Now - KES {rentStatus.balance.toLocaleString()}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Rent Payment Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-primary-900 to-primary-950 p-8 rounded-2xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="text-gold-400" size={28} />
                </div>
                {rentStatus.status === 'overdue' ? (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    OVERDUE
                  </span>
                ) : rentStatus.status === 'paid' ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 size={14} />
                    PAID
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                    PENDING
                  </span>
                )}
              </div>
              <h3 className="text-white/80 text-sm font-medium mb-2">Monthly Rent</h3>
              <p className="text-5xl font-bold text-white mb-6">
                KES {(currentLease.monthlyRent / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center justify-between text-sm text-white/70 mb-6">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  Due: {format(rentStatus.dueDate, 'MMM dd')}
                </span>
                {rentStatus.status === 'overdue' && (
                  <span className="text-red-300 font-semibold">
                    {rentStatus.daysOverdue} days overdue
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-500 hover:to-gold-700 text-primary-950 font-bold rounded-xl shadow-xl transition-all"
              >
                Pay Rent via M-Pesa
              </motion.button>
            </div>
          </motion.div>

          {/* Maintenance Request Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                <Wrench className="text-blue-700" size={28} />
              </div>
              {maintenanceRequests.filter(r => r.status !== 'completed').length > 0 && (
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  {maintenanceRequests.filter(r => r.status !== 'completed').length} Active
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Maintenance Requests</h3>
            <p className="text-gray-600 mb-6">
              Submit and track maintenance requests for your unit
            </p>
            <div className="space-y-3 mb-6">
              {maintenanceRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    request.status === 'in_progress' ? 'bg-blue-500' :
                    request.status === 'pending' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{request.issue}</p>
                    <p className="text-xs text-gray-500">{request.status.replace('_', ' ')}</p>
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMaintenanceForm(true)}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Submit New Request
            </motion.button>
          </motion.div>
        </div>

        {/* Lease Info & Utilities */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Lease Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Lease Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                  src={currentLease.propertyImage}
                  alt={currentLease.property}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="text-lg font-bold">{currentLease.property}</h4>
                  <p className="text-sm flex items-center gap-1">
                    <MapPin size={14} />
                    {currentLease.location}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unit</p>
                  <p className="font-semibold text-gray-900">{currentLease.unit} - {currentLease.unitType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lease Period</p>
                  <p className="font-semibold text-gray-900">
                    {format(currentLease.leaseStart, 'MMM dd, yyyy')} - {format(currentLease.leaseEnd, 'MMM dd, yyyy')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{daysUntilLeaseEnd} days remaining</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Landlord</p>
                  <p className="font-semibold text-gray-900">{currentLease.landlord}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Phone size={14} />
                    {currentLease.landlordPhone}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Utilities Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Utilities</h3>
            <div className="space-y-4">
              {utilities.map((utility, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className={`p-2 rounded-lg ${
                    utility.type === 'Water' ? 'bg-blue-100' :
                    utility.type === 'Electricity' ? 'bg-yellow-100' :
                    'bg-purple-100'
                  }`}>
                    {utility.type === 'Water' && <Droplet className="text-blue-600" size={20} />}
                    {utility.type === 'Electricity' && <Zap className="text-yellow-600" size={20} />}
                    {utility.type === 'Internet' && <Wifi className="text-purple-600" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{utility.type}</p>
                    {utility.consumption && (
                      <p className="text-xs text-gray-600">{utility.consumption} units</p>
                    )}
                    {utility.plan && (
                      <p className="text-xs text-gray-600">{utility.plan}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">KES {utility.cost.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Total Utilities</span>
                  <span className="text-lg font-bold text-primary-700">
                    KES {utilities.reduce((sum, u) => sum + u.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <button className="text-primary-600 hover:text-primary-700 font-semibold text-sm">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Method</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Reference</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{payment.month}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-gray-900">KES {payment.amount.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">{payment.method}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-mono text-sm text-gray-600">{payment.reference}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-600">{format(payment.paymentDate, 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} />
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg transition-all"
                      >
                        <Download size={16} />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Active Maintenance Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Active Maintenance Requests</h3>
          <div className="space-y-4">
            {maintenanceRequests.filter(r => r.status !== 'completed').map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-primary-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    request.priority === 'high' ? 'bg-red-100' :
                    request.priority === 'medium' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <Wrench className={
                      request.priority === 'high' ? 'text-red-600' :
                      request.priority === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    } size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{request.issue}</h4>
                        <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        Submitted: {format(request.submittedDate, 'MMM dd, yyyy')}
                      </span>
                      {request.assignedTo && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 size={14} />
                          Assigned to: {request.assignedTo}
                        </span>
                      )}
                      {request.estimatedCompletion && (
                        <span className="flex items-center gap-1 text-primary-600 font-semibold">
                          <Calendar size={14} />
                          Est. completion: {format(request.estimatedCompletion, 'MMM dd')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Maintenance Request Form Modal */}
      {showMaintenanceForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setShowMaintenanceForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <Wrench className="text-primary-700" size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Submit Maintenance Request</h3>
                    <p className="text-sm text-gray-600">We'll get back to you within 24 hours</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMaintenanceForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>
            </div>
            <form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Issue Summary *
                </label>
                <input
                  type="text"
                  value={maintenanceForm.issue}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, issue: e.target.value })}
                  placeholder="e.g., Leaking faucet in kitchen"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Detailed Description *
                </label>
                <textarea
                  value={maintenanceForm.description}
                  onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                  placeholder="Please provide detailed information about the issue..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all resize-none"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={maintenanceForm.category}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                  >
                    <option value="general">General</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="hvac">HVAC</option>
                    <option value="security">Security</option>
                    <option value="appliance">Appliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={maintenanceForm.priority}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 transition-all"
                  >
                    <option value="low">Low - Can wait a few days</option>
                    <option value="medium">Medium - Within this week</option>
                    <option value="high">High - Urgent attention needed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-all cursor-pointer">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setShowMaintenanceForm(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send size={20} />
                  Submit Request
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
