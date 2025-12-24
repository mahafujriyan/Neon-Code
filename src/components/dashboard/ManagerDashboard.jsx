"use client";
import { useEffect, useState } from "react";
import AddOrderModal from "../AddFroms/AddOrderForms";
import OrderTable from "./OrderTable";

export default function ManagerDashboard({ user, role, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user && role) loadData();
  }, [user, role]);

  const loadData = async () => {
    try {
      // ইমেইল প্যারামিটারটি ছোট হাতের করা নিরাপদ (Best Practice)
      const res = await fetch(`/api/orders?email=${user.email.toLowerCase()}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const calcStats = (data) => {
    const usd = data.reduce((s, o) => s + (Number(o.totalAmountUSD) || 0), 0);
    const rev = data.reduce((s, o) => s + (Number(o.totalAmountUSD) * Number(o.dollarRate || 135)), 0);
    const profit = data.reduce((s, o) => s + ((Number(o.dollarRate || 135) - Number(o.buyRate || 130)) * Number(o.totalAmountUSD || 0)), 0);
    const paid = data.reduce((total, order) => total + (order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0), 0);
    return { usd, rev, profit, paid, due: rev - paid, count: data.length };
  };

  const filteredOrders = orders.filter(o => new Date(o.orderDate || o.createdAt).toISOString().split('T')[0] === selectedDate);
  const mStats = calcStats(orders.filter(o => new Date(o.orderDate || o.createdAt) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const tStats = calcStats(filteredOrders);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px]">NeonCode Syncing...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* PREMIUM TOP BAR */}
      <div className="sticky top-0 z-50 mb-8 backdrop-blur-xl bg-white/80 dark:bg-[#020617]/90 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-4 md:p-5 shadow-xl shadow-slate-200/40 dark:shadow-none">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <span className="text-white font-black text-xl italic">N</span>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">Manager Dashboard</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                {user.email}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-100 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-[11px] font-bold outline-none focus:ring-2 ring-indigo-500/30 transition-all cursor-pointer shadow-inner dark:text-slate-300"
            />
            <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
              + Add Order
            </button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
               <span className="px-3 text-[9px] font-black uppercase text-indigo-500">{role}</span>
               <button onClick={onLogout} className="bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all">Exit</button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#1e293b] dark:bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly Overview</h3>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[15px] font-bold text-indigo-300">Orders: {mStats.count}</div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatBox label="Total USD" val={`$${mStats.usd.toLocaleString()}`} color="text-amber-400" />
                  <StatBox label="Revenue ৳" val={`৳${mStats.rev.toLocaleString()}`} />
                  <StatBox label="Profit ৳" val={`৳${mStats.profit.toLocaleString()}`} color="text-emerald-400" isHighlight />
                  <StatBox label="Paid ৳" val={`৳${mStats.paid.toLocaleString()}`} color="text-sky-400" />
                  <StatBox label="Due ৳" val={`৳${mStats.due.toLocaleString()}`} color="text-rose-400" isWide />
              </div>
            </div>
        </div>

        <div className="bg-[#0f172a] dark:bg-[#111827] rounded-[2.5rem] p-8 text-white shadow-2xl border border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Stats</h3>
                  <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[15px] font-bold text-emerald-400">
                    Today Orders: {tStats.count}
                  </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatBox label="Order USD" val={`$${tStats.usd.toLocaleString()}`} color="text-yellow-300" />
                  <StatBox label="Revenue ৳" val={`৳${tStats.rev.toLocaleString()}`} />
                  <StatBox label="Profit ৳" val={`৳${tStats.profit.toLocaleString()}`} color="text-emerald-300" isHighlight />
                  <StatBox label="Paid ৳" val={`৳${tStats.paid.toLocaleString()}`} color="text-green-400" />
                  <StatBox label="Due ৳" val={`৳${tStats.due.toLocaleString()}`} color="text-orange-400" isWide />
              </div>
            </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800/60 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/20">
          <h2 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic text-base">Transaction Records</h2>
          <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20">
            {filteredOrders.length} Entries found
          </div>
        </div>
        <div className="p-4 overflow-x-auto">
          <OrderTable orders={orders} refresh={loadData} role={role} selectedDate={selectedDate} />
        </div>
      </div>

      {/* FIXED: userEmail={user.email} অ্যাড করা হলো */}
      {showModal && (
        <AddOrderModal 
          onClose={() => setShowModal(false)} 
          refresh={loadData} 
          userEmail={user.email} 
        />
      )}
    </div>
  );
}

function StatBox({ label, val, color = "text-white", isHighlight = false, isWide = false }) {
  return (
    <div className={`${isWide ? 'col-span-2' : ''} ${isHighlight ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : 'bg-white/5'} p-4 rounded-2xl border border-white/5 shadow-inner`}>
      <p className="text-[9px] opacity-50 uppercase font-black tracking-widest mb-1 truncate">{label}</p>
      <p className={`text-lg md:text-xl font-black ${color} tracking-tighter break-word leading-none`}>
        {val}
      </p>
    </div>
  );
}