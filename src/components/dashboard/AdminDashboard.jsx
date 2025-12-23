"use client";

import { useState, useEffect } from "react";
import OrdersTable from "./OrderTable";
import AddOrderModal from "../AddFroms/AddOrderForms";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const loadData = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  if (!mounted) return <div className="p-6">Loading Dashboard...</div>;

  const totalRev = orders.reduce(
    (s, o) => s + (Number(o.totalAmountUSD) || 0),
    0
  );

  const totalPaid = orders.reduce(
    (s, o) =>
      s +
      (o.payments?.reduce((p, x) => p + (Number(x.paidUSD) || 0), 0) || 0),
    0
  );

  const totalDue = totalRev - totalPaid;

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900 dark:bg-[#0f172a] dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
        >
          + Add Order
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`$${totalRev}`} color="text-blue-600 dark:text-blue-400" />
        <StatCard title="Total Payments" value={`${totalPaid}`} color="text-green-600 dark:text-green-400" />
        <StatCard title="Total Dues" value={`${totalDue}`} color="text-red-600 dark:text-red-400" />
        <StatCard title="Total Orders" value={orders.length} color="text-purple-600 dark:text-purple-400" />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#020617] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
        <OrdersTable orders={orders} />
      </div>

      {/* MODAL */}
      {showModal && (
        <AddOrderModal
          onClose={() => setShowModal(false)}
          refresh={loadData}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white dark:bg-[#020617] border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <p className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <h3 className={`text-2xl font-black mt-2 ${color}`}>
        {value}
      </h3>
    </div>
  );
}
