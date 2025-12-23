"use client";
import { useState } from "react";
import AddOrderModal from "../AddFroms/AddOrderForms";

export default function OrderTable({ orders = [], refresh }) {
  const [editOrder, setEditOrder] = useState(null);

  // ডিলিট করার ফাংশন - যা আপনার API Route এর সাথে কাজ করবে
  const handleDelete = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে এই অর্ডারটি ডিলিট করতে চান?")) {
      try {
        const res = await fetch(`/api/orders?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          refresh(); // টেবিল ডাটা রিফ্রেশ করবে
        } else {
          const err = await res.json();
          alert("Error: " + err.error);
        }
      } catch (err) {
        alert("Error deleting order: " + err.message);
      }
    }
  };

  if (!orders.length) return <div className="p-10 text-center text-gray-400 italic">No Orders Found.</div>;

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-[#020617]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-100 dark:border-gray-800">
            <th className="p-5">Client & Contact</th>
            <th className="p-5 text-center">Manager</th> 
            <th className="p-5 text-center">
              <div className="grid grid-cols-6 gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 font-bold text-[9px]">
                <span>USD</span><span>Sell</span><span>Paid</span><span>Due</span> <span>Profit</span>
              </div>
            </th>
            <th className="p-5 text-center">Method</th>
            <th className="p-5 text-center">Status</th>
            <th className="p-5 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-[11px] font-bold">
          {orders.map((order) => {
            const totalUSD = Number(order.totalAmountUSD) || 0;
            const sellRate = Number(order.dollarRate) || 0;
            const buyRate = Number(order.buyRate) || 0;
            const totalPaidBDT = order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0;
            const totalBDT = totalUSD * sellRate;
            const profitBDT = (sellRate - buyRate) * totalUSD;
            const dueBDT = totalBDT - totalPaidBDT; 

            return (
              <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all group">
                <td className="p-5 min-w-[200px]">
                  <div className="text-gray-900 dark:text-white uppercase font-black tracking-tighter text-[13px]">
                    {order.clientName}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">
                    📞 {order.phone || "No Phone"}
                  </div>
                  <div className="flex gap-2 mt-2 items-center">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 text-[9px] font-black uppercase">
                      {order.orderType || "Service"}
                    </span>
                  </div>
                </td>

                <td className="p-5 text-center">
                  <span className="text-[9px] bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-600 dark:text-gray-300 font-black uppercase">
                    {order.managerName}
                  </span>
                </td>

                <td className="p-5">
                  <div className="grid grid-cols-6 gap-1 text-center items-center py-2.5 px-2 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 font-mono text-[10px]">
                    <span className="font-bold text-gray-900 dark:text-white">${totalUSD}</span>
                    <span className="opacity-60 italic">৳{sellRate}</span>
                    <span className="text-gray-600">৳{totalPaidBDT.toLocaleString()}</span>
                    <span className={`py-1 rounded font-black ${dueBDT > 0 ? 'text-red-500 bg-red-50 dark:bg-red-900/10' : 'text-green-500 opacity-40'}`}>
                      ৳{dueBDT.toLocaleString()}
                    </span>
                    <span className="text-green-600 font-black">
                      ৳{profitBDT.toLocaleString()}
                    </span>
                  </div>
                </td>

                <td className="p-5 text-center">
                   <span className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded text-[9px] font-black uppercase border border-orange-100 dark:border-orange-800/50">
                     {order.paymentMethod || "Bkash"}
                   </span>
                </td>

                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight ${
                    order.workStatus === 'completed' ? 'bg-green-100 text-green-700' : 
                    order.workStatus === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.workStatus}
                  </span>
                </td>

                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    {/* এডিট বাটন */}
                    <button 
                      onClick={() => setEditOrder(order)} 
                      className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all shadow-md active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>

                    {/* ডিলিট বাটন */}
                    <button 
                      onClick={() => handleDelete(order._id)} 
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-md active:scale-90"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editOrder && (
        <AddOrderModal 
          editData={editOrder} 
          onClose={() => setEditOrder(null)} 
          refresh={refresh} 
        />
      )}
    </div>
  );
}