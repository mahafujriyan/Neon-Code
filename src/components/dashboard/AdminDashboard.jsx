"use client";
import { useEffect, useState } from "react";
import AddOrderModal from "../AddFroms/AddOrderForms";
import OrderTable from "./OrderTable";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  /* ==========================================
      ১. মাসিক হিসাব (Monthly Calculation)
  ========================================== */
  const monthlyOrders = orders.filter(o => new Date(o.orderDate || o.createdAt) >= firstDayOfMonth);
  
  const mTotalUSD = monthlyOrders.reduce((s, o) => s + (Number(o.totalAmountUSD) || 0), 0);
  const mTotalRevenueBDT = monthlyOrders.reduce((s, o) => s + (Number(o.totalAmountUSD) * Number(o.dollarRate || 135)), 0);
  
  // মাসিক প্রফিট লজিক
  const mTotalProfitBDT = monthlyOrders.reduce((s, o) => 
    s + ((Number(o.dollarRate || 135) - Number(o.buyRate || 130)) * Number(o.totalAmountUSD || 0)), 0
  );

  const mTotalPaidBDT = monthlyOrders.reduce((total, order) => {
    return total + (order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0);
  }, 0);
  
  const mDueBDT = mTotalRevenueBDT - mTotalPaidBDT;

  /* ==========================================
      ২. আজকের হিসাব (Filtered Day)
  ========================================== */
  const filteredOrders = orders.filter(o => {
    const d = new Date(o.orderDate || o.createdAt).toISOString().split('T')[0];
    return d === selectedDate;
  });

  const tTotalUSD = filteredOrders.reduce((s, o) => s + (Number(o.totalAmountUSD) || 0), 0);
  const tTotalRevenueBDT = filteredOrders.reduce((s, o) => s + (Number(o.totalAmountUSD) * Number(o.dollarRate || 135)), 0);
  
  // আজকের প্রফিট লজিক
  const tTotalProfitBDT = filteredOrders.reduce((s, o) => 
    s + ((Number(o.dollarRate || 135) - Number(o.buyRate || 130)) * Number(o.totalAmountUSD || 0)), 0
  );

  const tTotalPaidBDT = filteredOrders.reduce((total, order) => {
    return total + (order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0);
  }, 0);
  
  const tDueBDT = tTotalRevenueBDT - tTotalPaidBDT;

  if (loading) return <div className="p-10 text-center font-bold text-indigo-600 italic tracking-widest uppercase">Edu-Teck Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#0f172a] text-gray-900 dark:text-white font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tighter text-indigo-600 dark:text-indigo-400">NeonCode Admin</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Client Base: {new Set(orders.map(o => o.clientName)).size} Total</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl text-xs font-bold outline-none cursor-pointer"
          />
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] shadow-xl hover:scale-105 transition-all">
            + Create Order
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* MONTHLY SUMMARY CARD */}
        <div className="bg-gradient-to-br from-indigo-700 to-purple-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black opacity-60 uppercase tracking-[0.2em]">Monthly Overview</h3>
            <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full uppercase">Orders: {monthlyOrders.length}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold text-yellow-300">Total USD</p>
              <p className="text-xl font-black">${mTotalUSD.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold">Revenue ৳</p>
              <p className="text-xl font-black">৳{mTotalRevenueBDT.toLocaleString()}</p>
            </div>
            {/* মাসিক প্রফিট বক্স */}
            <div className="bg-green-500/30 p-4 rounded-2xl border border-green-400/40 ring-1 ring-green-400/50">
              <p className="text-[9px] uppercase font-bold text-green-300">Net Profit ৳</p>
              <p className="text-xl font-black text-green-300">৳{mTotalProfitBDT.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold text-blue-200">Paid ৳</p>
              <p className="text-xl font-black">৳{mTotalPaidBDT.toLocaleString()}</p>
            </div>
            <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/20 col-span-1 md:col-span-2">
              <p className="text-[9px] opacity-70 uppercase font-bold text-red-300">Due ৳</p>
              <p className="text-xl font-black text-red-300">৳{mDueBDT.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* TODAY SUMMARY CARD */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black opacity-60 uppercase tracking-[0.2em]">Stats for {selectedDate}</h3>
            <span className="text-[10px] font-black bg-black/20 px-3 py-1 rounded-full uppercase">Orders: {filteredOrders.length}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-black/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold text-yellow-200">Order USD</p>
              <p className="text-xl font-black text-yellow-200">${tTotalUSD.toLocaleString()}</p>
            </div>
            <div className="bg-black/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold">Revenue ৳</p>
              <p className="text-xl font-black">৳{tTotalRevenueBDT.toLocaleString()}</p>
            </div>
            {/* আজকের প্রফিট বক্স */}
            <div className="bg-white/20 p-4 rounded-2xl border border-white/30 ring-1 ring-white/40">
              <p className="text-[9px] uppercase font-bold text-emerald-100">Today Profit ৳</p>
              <p className="text-xl font-black text-white">৳{tTotalProfitBDT.toLocaleString()}</p>
            </div>
            <div className="bg-black/10 p-4 rounded-2xl border border-white/5">
              <p className="text-[9px] opacity-70 uppercase font-bold text-green-300">Paid ৳</p>
              <p className="text-xl font-black text-green-300">৳{tTotalPaidBDT.toLocaleString()}</p>
            </div>
            <div className="bg-black/10 p-4 rounded-2xl border border-white/5 col-span-1 md:col-span-2">
              <p className="text-[9px] opacity-70 uppercase font-bold text-orange-200">Due ৳</p>
              <p className="text-xl font-black text-orange-200">৳{tDueBDT.toLocaleString()}</p>
            </div>
          </div>
        </div>

      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-[#020617] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
          <h2 className="font-black text-gray-800 dark:text-white uppercase tracking-tighter italic">Order Records</h2>
          <div className="text-[10px] font-bold text-indigo-500 uppercase px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
            {filteredOrders.length} Records Shown
          </div>
        </div>
        <div className="p-2">
          <OrderTable orders={filteredOrders} refresh={loadData} />
        </div>
      </div>

      {showModal && <AddOrderModal onClose={() => setShowModal(false)} refresh={loadData} />}
    </div>
  );
}