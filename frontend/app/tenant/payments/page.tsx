"use client";

import { motion } from "framer-motion";
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { tenantData } from "@/lib/mock-data";
import { format } from "date-fns";
import Sidebar from "@/components/Sidebar";

export default function PaymentsPage() {
  const { rentStatus, paymentHistory, currentLease, maintenanceRequests } = tenantData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-cream to-gray-50">
      <Sidebar
        userType="tenant"
        currentPath="/tenant/payments"
        pendingRequests={maintenanceRequests.filter(r => r.status !== 'completed').length}
      />

      <div className="ml-72 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-lg text-gray-600">
            Manage your rent payments and view payment history
          </p>
        </motion.div>

        {/* Current Payment Status */}
        {rentStatus.status === "overdue" && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-xl shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-200 rounded-full">
                <AlertCircle className="text-red-700" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 mb-1">Payment Overdue</h3>
                <p className="text-red-700 mb-3">
                  Your rent payment was due on {format(rentStatus.dueDate, "MMMM dd, yyyy")} ({rentStatus.daysOverdue} days ago).
                  Please make payment immediately to avoid penalties.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all"
                  >
                    Pay Now - KES {rentStatus.balance.toLocaleString()}
                  </motion.button>
                  <button className="px-6 py-3 bg-white hover:bg-gray-50 text-red-700 font-semibold rounded-lg border-2 border-red-200 transition-all">
                    Request Extension
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-gradient-to-br from-primary-900 to-primary-950 p-8 rounded-2xl shadow-2xl overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                  <CreditCard className="text-gold-400" size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  rentStatus.status === "overdue" ? "bg-red-500 text-white" :
                  rentStatus.status === "paid" ? "bg-green-500 text-white" :
                  "bg-yellow-500 text-white"
                }`}>
                  {rentStatus.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/80 text-sm mb-2">Monthly Rent</p>
              <p className="text-4xl font-bold text-white mb-4">
                KES {(currentLease.monthlyRent / 1000).toFixed(0)}K
              </p>
              <p className="text-white/70 text-sm flex items-center gap-2">
                <Calendar size={16} />
                Due: {format(rentStatus.dueDate, "MMM dd, yyyy")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="inline-flex p-3 bg-green-100 rounded-xl mb-4">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Payments Made</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {paymentHistory.length}
            </p>
            <p className="text-sm text-gray-600">All payments on time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="inline-flex p-3 bg-blue-100 rounded-xl mb-4">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Next Payment</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">
              KES {(currentLease.monthlyRent / 1000).toFixed(0)}K
            </p>
            <p className="text-sm text-gray-600">
              {format(rentStatus.nextPaymentDue, "MMM dd, yyyy")}
            </p>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <button className="p-6 border-2 border-green-200 hover:border-green-400 bg-green-50 rounded-xl transition-all text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-green-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">M-Pesa</h3>
                  <p className="text-sm text-gray-600">Pay via M-Pesa (Recommended)</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Till Number: 5678901 • Paybill: 123456</p>
            </button>

            <button className="p-6 border-2 border-gray-200 hover:border-primary-300 bg-gray-50 rounded-xl transition-all text-left">
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-primary-600 rounded-lg">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">Direct bank transfer</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">Account: 1234567890 • Bank: KCB</p>
            </button>
          </div>
        </motion.div>

        {/* Payment History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-lg"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Payment History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
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
                {paymentHistory.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
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
                      <p className="text-gray-600">{format(payment.paymentDate, "MMM dd, yyyy")}</p>
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
      </div>
    </div>
  );
}
