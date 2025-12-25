"use client";
import { useState, useEffect } from "react";

export default function AddOrderModal({ onClose, refresh, editData = null, userEmail }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    pageLink: "",
    orderType: "Facebook Ads",
    managerName: "Sagor",
    totalAmountUSD: "", 
    taskCount: "", 
    dollarRate: 135,    
    buyRate: 130,       
    initialPaidUSD: "", 
    paymentMethod: "Bkash", 
    workStatus: "pending",
    note: "", 
  });

  useEffect(() => {
    if (editData) {
      const totalPaid = editData.payments?.reduce((s, p) => s + (Number(p.paidUSD) || 0), 0) || 0;
      const existingValue = (Number(editData.totalAmountUSD) > 0) ? editData.totalAmountUSD : (editData.taskCount || "");
      
      // পেমেন্ট মেথড রিট্রিভ করা
      const lastPaymentMethod = editData.payments?.[0]?.paymentMethod || editData.paymentMethod || "Bkash";

      setForm({
        ...editData,
        totalAmountUSD: existingValue,
        initialPaidUSD: totalPaid,
        managerName: editData.managerName || "Sagor",
        paymentMethod: lastPaymentMethod,
        note: editData.note || "",
      });
    }
  }, [editData]);

  const isAdsType = form.orderType === "Facebook Ads" || form.orderType === "Followers/Likes";
  const commonInputValue = Number(form.totalAmountUSD) || 0; 
  const sellRate = Number(form.dollarRate) || 0;
  const effectiveBuyRate = isAdsType ? (Number(form.buyRate) || 0) : 0;
  const paidAmount = Number(form.initialPaidUSD) || 0;

  const revenue = commonInputValue * sellRate;
  const profit = (sellRate - effectiveBuyRate) * commonInputValue; 
  const due = revenue - paidAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return alert("Error: Email missing");

    setLoading(true);
    try {
      // অপ্রয়োজনীয় ডাটা বাদ দিয়ে ফ্রেশ ডাটা নেওয়া
      const { _id, createdAt, updatedAt, payments, ...cleanForm } = form;
      
      // নতুন অর্ডারের জন্য পেমেন্ট অ্যারে তৈরি করা
      const currentPayments = editData ? editData.payments : [{ 
        paidUSD: paidAmount, 
        paymentMethod: form.paymentMethod, 
        paymentDate: new Date() 
      }];

      const payload = {
        ...cleanForm,
        totalAmountUSD: isAdsType ? commonInputValue : 0, 
        taskCount: !isAdsType ? commonInputValue : 0, 
        dollarRate: sellRate, 
        buyRate: isAdsType ? effectiveBuyRate : 0, 
        managerEmail: userEmail,
        note: form.note || "",
        payments: currentPayments,
        paymentMethod: form.paymentMethod // ব্যাকআপ মেথড
      };

      if (editData) payload.id = editData._id;

      const res = await fetch("/api/orders", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        refresh();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save order");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm md:text-base";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] p-3 md:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-[#020617] rounded-[32px] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-800 my-auto transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-black uppercase text-indigo-600 dark:text-white italic tracking-tighter">
            {editData ? "Edit Order" : "New Order Entry"}
          </h2>
          <button onClick={onClose} type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Client Name</label><input required placeholder="Name" className={inputClass} value={form.clientName} onChange={(e)=>setForm({...form, clientName: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Phone</label><input placeholder="017..." className={inputClass} value={form.phone} required onChange={(e)=>setForm({...form, phone: e.target.value})} /></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Project Link</label><input placeholder="URL" className={inputClass} value={form.pageLink} onChange={(e)=>setForm({...form, pageLink: e.target.value})} /></div>
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Service Type</label><select className={`${inputClass} text-indigo-500`} value={form.orderType} onChange={(e)=>setForm({...form, orderType: e.target.value})}><option value="Facebook Ads">Facebook Ads (USD)</option><option value="Followers/Likes">Followers/Likes (USD)</option><option value="Page Setup">Page Setup (BDT)</option><option value="Graphics Design">Graphics Design (BDT)</option><option value="Web Development">Web Development (BDT)</option></select></div>
          </div>

          <div className="p-6 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-indigo-400">{isAdsType ? "Total USD" : "Total Task"}</label><input type="number" step="any" className="w-full bg-transparent font-black text-lg outline-none dark:text-white" value={form.totalAmountUSD} onChange={(e)=>setForm({...form, totalAmountUSD: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-indigo-400">Rate</label><input type="number" step="any" className="w-full bg-transparent font-black text-lg outline-none dark:text-white" value={form.dollarRate} onChange={(e)=>setForm({...form, dollarRate: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-blue-500">Buy Rate</label><input type="number" step="any" className="w-full bg-transparent font-black text-lg outline-none text-blue-500" value={isAdsType ? form.buyRate : 0} disabled={!isAdsType} onChange={(e)=>setForm({...form, buyRate: e.target.value})} /></div>
              <div className="space-y-1"><label className="text-[9px] font-black uppercase text-green-500">Paid (৳)</label><input type="number" step="any" className="w-full bg-transparent font-black text-lg outline-none text-green-600" value={form.initialPaidUSD} onChange={(e)=>setForm({...form, initialPaidUSD: e.target.value})} /></div>
            </div>
            
            <div className="mb-4">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Payment Method</label>
                <select className={`${inputClass} mt-1`} value={form.paymentMethod} onChange={(e)=>setForm({...form, paymentMethod: e.target.value})}>
                    <option value="Bkash">Bkash</option>
                    <option value="Nagad">Nagad</option>
                    <option value="Rocket">Rocket</option>
                    <option value="Card">Card</option>
                    <option value="Bank">Bank</option>
                    <option value="Cash">Cash</option>
                </select>
            </div>

            <div className="flex flex-wrap justify-between items-center border-t border-indigo-100 dark:border-indigo-900/50 pt-4 gap-2">
               <div><span className="block text-[9px] font-bold text-gray-400 uppercase">Revenue</span><span className="text-xl font-black text-indigo-600 dark:text-indigo-400">৳{revenue.toLocaleString()}</span></div>
               <div className="text-center"><span className="block text-[9px] font-bold text-green-500 uppercase">Profit</span><span className="text-xl font-black text-green-600 italic">৳{profit.toLocaleString()}</span></div>
               <div className="text-right"><span className="block text-[9px] font-bold text-red-400 uppercase">Due</span><span className="text-xl font-black text-red-500">৳{due.toLocaleString()}</span></div>
            </div>
          </div>

          <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Order Note</label><textarea rows="2" placeholder="অর্ডারের তথ্য..." className={`${inputClass} resize-none py-3`} value={form.note} onChange={(e)=>setForm({...form, note: e.target.value})}></textarea></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Assigned Manager</label><select className={inputClass} value={form.managerName} onChange={(e)=>setForm({...form, managerName: e.target.value})}><option value="Sagor">Sagor</option><option value="Shahed">Shahed</option><option value="Mahafuj">Mahafuj</option><option value="M Abdur Rahaman">M Abdur Rahaman</option></select></div>
            <div className="space-y-1"><label className="text-[10px] font-black uppercase ml-2 text-gray-400">Work Status</label><select className={inputClass} value={form.workStatus} onChange={(e)=>setForm({...form, workStatus: e.target.value})}><option value="pending">Pending</option><option value="running">Running</option><option value="completed">Completed</option></select></div>
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50 text-sm">
            {loading ? "Processing..." : (editData ? "Update Order" : "Confirm & Save Order")}
          </button>
        </form>
      </div>
    </div>
  ); 
}