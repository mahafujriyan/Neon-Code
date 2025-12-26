"use client";
import { useState } from "react";
import AddOrderModal from "../AddFroms/AddOrderForms";
import { useAuth } from "@/context/AuthContext"; 
import { auth } from "@/lib/firebase";

export default function OrderTable({ orders = [], refresh, role, selectedDate }) {
  const [editOrder, setEditOrder] = useState(null);
  const [filterMode, setFilterMode] = useState("daily");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth(); 

  const getLocalDate = (dateInput) => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  let filteredData = orders.filter((o) => {
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
  });

  if (searchQuery) {
    filteredData = filteredData.filter((o) => 
      o.phone?.includes(searchQuery) || 
      o.clientName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filteredData = filteredData.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));

 // ... আপনার কোড একই থাকবে ...

  const handleDelete = async (orderId) => {
    // ১. আপনার পাঠানো role প্রপস বা Context থেকে রোল চেক
    const currentUserRole = role || user?.role; 
    
    if (currentUserRole?.toLowerCase() !== "admin") {
      alert(`⚠️ পারমিশন নেই! আপনার বর্তমান রোল: ${currentUserRole}`);
      return;
    }

    // ২. ইমেইল ট্রিম করা হয়েছে যাতে কোনো স্পেসের কারণে এরর না আসে
    const adminEmail = user?.email || auth.currentUser?.email;
    if (!adminEmail) {
      alert("⚠️ সেশন পাওয়া যাচ্ছে না। পেজটি রিফ্রেশ দিয়ে আবার চেষ্টা করুন।");
      return;
    }

    if (window.confirm("আপনি কি নিশ্চিতভাবে এই অর্ডারটি ডিলিট করতে চান?")) {
      try {
        const res = await fetch(`/api/orders?id=${orderId}&email=${encodeURIComponent(adminEmail.toLowerCase().trim())}`, { 
          method: "DELETE" 
        });

        const data = await res.json();

        if (res.ok) {
          alert("সফলভাবে ডিলিট হয়েছে! ✅");
          refresh(); 
        } else {
          alert(`ডিলিট ব্যর্থ: ${data.error}`);
        }
      } catch (err) { 
        alert("সার্ভার এরর: " + err.message); 
      }
    }
  };

 


  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-gray-900/50 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex flex-wrap gap-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <button onClick={() => setFilterMode("daily")} className={`px-6 py-2.5 rounded-xl text-[13px] font-black uppercase transition-all ${filterMode === "daily" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-indigo-500"}`}>
            Daily: {selectedDate}
          </button>
          <button onClick={() => setFilterMode("monthly")} className={`px-6 py-2.5 rounded-xl text-[13px] font-black uppercase transition-all ${filterMode === "monthly" ? "bg-indigo-600 text-white shadow-md" : "text-gray-500 hover:text-indigo-500"}`}>
            Monthly View
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <input type="text" placeholder="Search by Phone or Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all dark:text-white" />
          <svg className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
          <p className="text-[14px] font-black text-indigo-600 uppercase">Records Found: {filteredData.length}</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-[#020617]">
        {!filteredData.length ? (
          <div className="p-20 text-center text-gray-400 uppercase text-[18px] font-black">No Matches Found</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-400 text-[14px] uppercase font-black border-b border-gray-100 dark:border-gray-800">
                <th className="p-6">Client & Service</th>
                <th className="p-6 text-center">Manager & Note</th> 
                <th className="p-6 text-center">Project Link</th>
                <th className="p-6 text-center">
                   <div className="grid grid-cols-6 gap-2 mb-2 text-[10px] text-indigo-400 font-bold uppercase">
                     <span>USD/TASK</span><span>SELL</span><span>BUY</span><span>PAID</span><span>DUE</span><span>PROFIT</span>
                   </div>
                   Financial Records
                </th>
                <th className="p-6 text-center">Status</th>
                {role === "admin" && <th className="p-6 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-[16px] font-bold">
              {filteredData.map((order) => {
                const amountValue = order.totalAmountUSD > 0 ? order.totalAmountUSD : (order.taskCount || 0);
                const isUSD = order.totalAmountUSD > 0;
                const sellRate = Number(order.dollarRate) || 0;
                const buyRate = Number(order.buyRate) || 0;
                
                // পেমেন্ট এবং পেমেন্ট মেথড রিট্রিভ (ব্যাকএন্ড ডাটা)
                const totalPaidBDT = order.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0;
                const payMethod = order.payments?.[0]?.paymentMethod || order.paymentMethod || "N/A";

                const revenue = amountValue * sellRate;
                const dueBDT = revenue - totalPaidBDT;
                const profitBDT = (sellRate - buyRate) * amountValue;
                const d = new Date(order.orderDate || order.createdAt);

                return (
                  <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg shrink-0">
                          <span className="text-[18px] font-black leading-none">{String(d.getDate()).padStart(2, '0')}</span>
                          <span className="text-[15px] uppercase">{d.toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white uppercase font-black text-[20px]">{order.clientName}</div>
                          <div className="text-indigo-500 text-[14px] font-bold uppercase">{order.orderType}</div>
                          <div className="text-gray-400 text-[12px]">📞 {order.phone || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-gray-700 dark:text-gray-300 uppercase text-[18px] font-black italic">{order.managerName}</div>
                      {order.note && <div className="text-[12px] text-gray-400 font-normal mt-1 max-w-[150px] mx-auto truncate" title={order.note}>"{order.note}"</div>}
                    </td>
                    <td className="p-6 text-center">
                      {order.pageLink ? <a href={order.pageLink.startsWith('http') ? order.pageLink : `https://${order.pageLink}`} target="_blank" rel="noreferrer" className="text-blue-500 font-black hover:underline">🌐 Visit</a> : "---"}
                    </td>
                    <td className="p-6">
                      <div className="grid grid-cols-6 gap-2 text-center items-center py-3 px-4 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 font-mono text-[16px]">
                        <span className="text-indigo-600 font-black">{isUSD ? `$${amountValue}` : `${amountValue}T`}</span>
                        <span className="text-gray-400">৳{sellRate}</span>
                        <span className="text-rose-400/80">৳{buyRate}</span>
                        
                        {/* পেমেন্ট এবং মেথড এখানে দেখানো হচ্ছে */}
                        <span className="text-gray-700 dark:text-gray-300">
                            ৳{totalPaidBDT.toLocaleString()}
                            <div className="text-[11px] text-green-500 font-bold uppercase leading-none mt-1">{payMethod}</div>
                        </span>

                        <span className={`font-black ${dueBDT > 0 ? "text-red-500" : "text-green-500 opacity-40"}`}>৳{dueBDT.toLocaleString()}</span>
                        <span className="text-green-600 font-black">৳{profitBDT.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[14px] font-black uppercase ${order.workStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{order.workStatus}</span>
                    </td>
                    {role === "admin" && (
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditOrder(order)} className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md transition-transform active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                          <button onClick={() => handleDelete(order._id)} className="p-2.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
   {/* নিচে এডিট মোড-এ userEmail পাসিং ফিক্স */}
  {editOrder && (
    <AddOrderModal 
      editData={editOrder} 
      onClose={() => setEditOrder(null)} 
      refresh={refresh} 
      userEmail={user?.email || auth.currentUser?.email || editOrder.managerEmail} 
    />
  )}
    </div>
  );
}