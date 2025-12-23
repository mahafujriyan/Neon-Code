"use client";
import { useState, useEffect } from "react";

export default function AddOrderModal({ onClose, refresh, editData = null }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    pageLink: "",
    orderType: "Facebook Ads",
    managerName: "Sagor",
    totalAmountUSD: "",
    dollarRate: 135, 
    buyRate: 130,    
    paymentMethod: "Bkash",
    initialPaidUSD: "",
    workStatus: "pending",
    workProof: "",
  });

  useEffect(() => {
    if (editData) {
      // মোট কত পেইড হয়েছে তা বের করা
      const totalPaid = editData.payments?.reduce((s, p) => s + (Number(p.paidUSD) || 0), 0) || 0;
      setForm({
        ...editData,
        initialPaidUSD: totalPaid,
        buyRate: editData.buyRate || 130,
        // ডাটাবেজে Shahed থাকলে সেটা সেট হবে, Sahed থাকলে Sahed
        managerName: editData.managerName || "Sagor", 
        paymentMethod: editData.paymentMethod || "Bkash",
      });
      if (editData.workProof) setPreview(editData.workProof);
    }
  }, [editData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, workProof: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ক্লিন ডাটা কপি করা
      const { _id, createdAt, updatedAt, payments, ...cleanForm } = form;

      const payload = {
        ...cleanForm,
        totalAmountUSD: Number(form.totalAmountUSD) || 0,
        dollarRate: Number(form.dollarRate) || 0,
        buyRate: Number(form.buyRate) || 0,
     
        paymentMethod: form.paymentMethod || "Bkash",
      };

      // পেমেন্ট অ্যারে হ্যান্ডলিং
      payload.payments = [{
        paidUSD: Number(form.initialPaidUSD) || 0,
        date: new Date(),
      }];

      if (editData) {
        payload.id = editData._id;
      }

      const res = await fetch("/api/orders", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        refresh();
        onClose();
      } else {
        const errRes = await res.json();
        alert("Error: " + errRes.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalUSD = Number(form.totalAmountUSD) || 0;
  const sellRate = Number(form.dollarRate) || 0;
  const buyRate = Number(form.buyRate) || 0;
  const paidUSD = Number(form.initialPaidUSD) || 0;

  const totalBDT = totalUSD * sellRate;
  const profitBDT = (sellRate - buyRate) * totalUSD;
  const dueBDT = totalBDT - paidUSD;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#020617] rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black uppercase dark:text-white italic tracking-tighter">
            {editData ? "Update Order" : "New Order Entry"}
          </h2>
          <button onClick={onClose} className="text-3xl font-light dark:text-white">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Client Name" className="modal-input" value={form.clientName} onChange={(e)=>setForm({...form, clientName: e.target.value})} />
            <input placeholder="Phone" className="modal-input" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Page Link" className="modal-input" value={form.pageLink} onChange={(e)=>setForm({...form, pageLink: e.target.value})} />
            <select className="modal-input font-bold" value={form.orderType} onChange={(e)=>setForm({...form, orderType: e.target.value})}>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Page Setup">Page Setup</option>
              <option value="Followers/Likes">Followers/Likes</option>
              <option value="Graphics Design">Graphics Design</option>
              <option value="Media Production">Media Production</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 items-center">
            <div>
               <label className="text-[10px] font-black uppercase opacity-40 block mb-1 dark:text-white">Proof / SS</label>
               <input type="file" accept="image/*" onChange={handleImageChange} className="text-[10px] w-full" />
            </div>
            <div>
               <label className="text-[10px] font-black uppercase opacity-40 block mb-1 dark:text-white">Payment Method</label>
             <select 
       className="..." 
         value={form.paymentMethod} 
         onChange={(e)=>setForm({...form, paymentMethod: e.target.value})}
>
           <option value="Bkash">Bkash</option>
             <option value="Nagad">Nagad</option>
          <option value="Rocket">Rocket</option>
          <option value="Bank">Bank</option>
            <option value="Cash">Cash</option>
            </select>
            </div>
          </div>

          <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-[9px] font-black block dark:text-gray-400">Total USD</label>
                <input type="number" className="w-full bg-transparent font-black text-lg outline-none dark:text-white" value={form.totalAmountUSD} onChange={(e)=>setForm({...form, totalAmountUSD: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black block dark:text-gray-400">Sell Rate ৳</label>
                <input type="number" className="w-full bg-transparent font-black text-lg outline-none dark:text-white" value={form.dollarRate} onChange={(e)=>setForm({...form, dollarRate: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black block text-blue-500">Buy Rate ৳</label>
                <input type="number" className="w-full bg-transparent font-black text-lg outline-none text-blue-500" value={form.buyRate} onChange={(e)=>setForm({...form, buyRate: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-black block text-green-600">Paid USD</label>
                <input type="number" className="w-full bg-transparent font-black text-lg outline-none text-green-600" value={form.initialPaidUSD} onChange={(e)=>setForm({...form, initialPaidUSD: e.target.value})} />
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-end font-black uppercase border-t border-indigo-100 dark:border-indigo-800 pt-3 gap-4">
               <div>
                  <span className="block text-[9px] text-gray-400">Revenue</span>
                  <span className="text-xl text-indigo-600">৳{totalBDT.toLocaleString()}</span>
               </div>
               <div className="text-center">
                  <span className="block text-[14px] text-green-500">Profit</span>
                  <span className="text-2xl text-green-600 italic">৳{profitBDT.toLocaleString()}</span>
               </div>
               <div className="text-right text-red-500">
                  <span className="block text-[9px]">Due</span>
                  <span className="text-xl">৳{dueBDT.toLocaleString()}</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={form.managerName} className="modal-input font-bold" onChange={(e)=>setForm({...form, managerName: e.target.value})}>
               <option value="Sagor">Sagor</option>
               {/* এখানে Shahed স্পেলিংটি ডাটাবেজ মডালের সাথে মিলিয়ে দেয়া হলো */}
               <option value="Shahed">Shahed</option> 
               <option value="M. Abdur Rahaman">M. Abdur Rahaman</option>
               <option value="Mahafuj">Mahafuj</option>
            </select>
            <select value={form.workStatus} className={`modal-input font-black uppercase text-[10px] ${form.workStatus === 'completed' ? 'text-green-500' : 'text-orange-500'}`} onChange={(e)=>setForm({...form, workStatus: e.target.value})}>
               <option value="pending">Pending</option>
               <option value="running">Running</option>
               <option value="completed">Completed</option>
            </select>
          </div>

          <button disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
            {loading ? "Processing..." : (editData ? "Update Record" : "Save Order Now")}
          </button>
        </form>
      </div>
      <style jsx>{`.modal-input { width: 100%; padding: 1rem; border-radius: 1.25rem; background: #f3f4f6; border: 1px solid transparent; outline: none; } :global(.dark) .modal-input { background: #111827; color: white; border-color: #1f2937; } .modal-input:focus { border-color: #6366f1; background: white; }`}</style>
    </div>
  );
}