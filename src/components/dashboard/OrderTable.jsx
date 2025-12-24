"use client";
import { useState } from "react";
import AddOrderModal from "../AddFroms/AddOrderForms";

export default function OrderTable({ orders = [], refresh, role, selectedDate }) {
  const [editOrder, setEditOrder] = useState(null);
  const [filterMode, setFilterMode] = useState("daily");

  const getLocalDate = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const filteredData = orders.filter((o) => {
    const orderDateObj = new Date(o.orderDate || o.createdAt);
    const orderDateStr = getLocalDate(orderDateObj);
    
    if (filterMode === "daily") {
      return orderDateStr === selectedDate;
    } else {
      const now = new Date();
      return (
        orderDateObj.getFullYear() === now.getFullYear() &&
        orderDateObj.getMonth() === now.getMonth()
      );
    }
  }).sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));

  const handleDelete = async (id) => {
    if (role !== "admin") {
      alert("⚠️ অ্যাক্সেস ডিনাইড!");
      return;
    }
    if (window.confirm("আপনি কি নিশ্চিতভাবে ডিলিট করতে চান?")) {
      try {
        const res = await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
        if (res.ok) refresh();
      } catch (err) { alert(err.message); }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ফিল্টার বার */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setFilterMode("daily")}
            className={`px-8 py-3 rounded-xl text-[14px] font-black uppercase transition-all ${
              filterMode === "daily" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500"
            }`}
          >
            Daily: {selectedDate}
          </button>
          <button
            onClick={() => setFilterMode("monthly")}
            className={`px-8 py-3 rounded-xl text-[14px] font-black uppercase transition-all ${
              filterMode === "monthly" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500"
            }`}
          >
            Monthly View
          </button>
        </div>
        <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-[14px] font-black text-indigo-600 uppercase">
            Records: {filteredData.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-[#020617]">
        {!filteredData.length ? (
          <div className="p-20 text-center text-gray-400 uppercase text-[18px] font-black">No Data Found</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[14px] uppercase font-black border-b border-gray-100 dark:border-gray-800">
                <th className="p-6">Entry Date & Client</th>
                <th className="p-6 text-center">Manager</th> 
                <th className="p-6 text-center">Page/Link</th>
                <th className="p-6 text-center">
                   <div className="grid grid-cols-5 gap-2 mb-2 text-[10px] text-indigo-400 font-bold">
                     <span>USD</span><span>RATE</span><span>PAID</span><span>DUE</span><span>PROFIT</span>
                   </div>
                   Financial Records
                </th>
                <th className="p-6 text-center">Status</th>
                {role === "admin" && <th className="p-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-[16px] font-bold">
              {filteredData.map((order) => {
                const totalUSD = Number(order.totalAmountUSD) || 0;
                const sellRate = Number(order.dollarRate) || 0;
                const totalPaidBDT = order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0;
                const dueBDT = (totalUSD * sellRate) - totalPaidBDT;
                const profitBDT = (sellRate - (Number(order.buyRate) || 0)) * totalUSD;
                
                const d = new Date(order.orderDate || order.createdAt);
                const day = String(d.getDate()).padStart(2, '0');
                const month = d.toLocaleString('default', { month: 'short' });

                return (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                          <span className="text-[20px] font-black leading-none">{day}</span>
                          <span className="text-[10px] uppercase">{month}</span>
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white uppercase font-black text-[18px]">{order.clientName}</div>
                          <div className="text-gray-400 text-[14px]">📞 {order.phone || "N/A"}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6 text-center uppercase text-[14px] text-gray-500 font-black italic">
                      {order.managerName}
                    </td>

                    <td className="p-6 text-center">
                      {order.pageLink ? (
                        <a 
                          href={order.pageLink.startsWith('http') ? order.pageLink : `https://${order.pageLink}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[14px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all border border-blue-100 dark:border-blue-800"
                        >
                          🌐 Visit Page
                        </a>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-700 italic text-[14px]">No Link</span>
                      )}
                    </td>

                    <td className="p-6">
                      <div className="grid grid-cols-5 gap-2 text-center items-center py-4 px-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 font-mono text-[16px]">
                        <span className="text-indigo-600 font-black">${totalUSD}</span>
                        <span className="opacity-40 italic">৳{sellRate}</span>
                        <span className="text-gray-700">৳{totalPaidBDT.toLocaleString()}</span>
                        <span className={`font-black ${dueBDT > 0 ? "text-red-500" : "text-green-500 opacity-40"}`}>
                          ৳{dueBDT.toLocaleString()}
                        </span>
                        <span className="text-green-600 font-black">৳{profitBDT.toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="p-6 text-center">
                      <span className={`px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-tighter shadow-sm ${
                        order.workStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {order.workStatus}
                      </span>
                    </td>

                    {role === "admin" && (
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => setEditOrder(order)} className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-[14px] font-black hover:scale-105 transition-all shadow-md">Update</button>
                          <button onClick={() => handleDelete(order._id)} className="px-5 py-3 bg-red-100 text-red-600 rounded-xl text-[14px] font-black hover:bg-red-500 hover:text-white transition-all">Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editOrder && <AddOrderModal editData={editOrder} onClose={() => setEditOrder(null)} refresh={refresh} />}
    </div>
  );
}