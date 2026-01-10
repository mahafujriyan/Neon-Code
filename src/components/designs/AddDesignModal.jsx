"use client";
import { useState, useEffect } from "react";

export default function AddDesignModal({ onClose, refresh, user, editData = null, selectedDate, designs = [] }) {
  const [loading, setLoading] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);
  const [managerQuotaBase, setManagerQuotaBase] = useState(0); 

  const generateDateId = (dateStr) => {
    if (!dateStr) return "";
    return `C-${dateStr.replace(/-/g, "")}-`; 
  };

  const [form, setForm] = useState({
    managerName: user?.name || "Abdullah GFX",
    managerEmail: user?.email || "",
    clientId: generateDateId(selectedDate), 
    description: "", 
    driveLink: "",
    imageUrl: "", 
    totalTasks: 10, 
    completeTasks: 0,
    successCount: 0,
    pendingTasks: 0,
    rejectCount: 0,
  });

  const managerList = ["Abdullah GFX", "Redowan", "Arko"];
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (editData) {
      setForm({ ...editData });
      setIsExistingClient(true);
    }
  }, [editData]);

  useEffect(() => {
    if (editData) return;
    const timeoutId = setTimeout(() => {
      if (form.clientId.trim().length > 5) {
        const match = designs.find(d => d.clientId.trim() === form.clientId.trim());
        if (match) {
          setIsExistingClient(true);
          setForm(prev => ({ 
            ...prev, 
            ...match, 
            _id: match._id,
            managerName: prev.managerName 
          }));
        } else {
          setIsExistingClient(false);
        }
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [form.clientId, designs, editData]);

  useEffect(() => {
    const todaysOtherComplete = designs
      .filter(d => 
        d.managerName === form.managerName && 
        d.submittedDate === selectedDate && 
        d.clientId !== form.clientId
      )
      .reduce((acc, curr) => acc + (Number(curr.completeTasks) || 0), 0);

    const previousPending = designs
      .filter(d => d.managerName === form.managerName && d.submittedDate !== selectedDate)
      .reduce((acc, curr) => acc + (Number(curr.pendingTasks) || 0), 0);

    setManagerQuotaBase(previousPending + (10 - todaysOtherComplete));
  }, [form.managerName, designs, form.clientId, selectedDate]);

  useEffect(() => {
    const complete = Number(form.completeTasks) || 0;
    const success = Number(form.successCount) || 0;

    setForm((prev) => ({
      ...prev,
      pendingTasks: managerQuotaBase - complete,
      rejectCount: complete - success,
    }));
  }, [form.completeTasks, form.successCount, managerQuotaBase]);

  const submit = async () => {
    if (form.clientId.length < 5) return alert("Please enter a valid Client ID");
    setLoading(true);
    try {
      const isUpdating = isExistingClient || !!form._id;
      const res = await fetch("/api/designs", {
        method: isUpdating ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedDate: selectedDate, id: form._id }),
      });

      if (res.ok) {
        refresh();
        onClose();
      }
    } catch (err) {
      alert("Error saving data!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[100] p-4 text-slate-900 dark:text-white">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto scroller-hidden">
        
        <div className="flex justify-between items-center mb-6 border-b dark:border-slate-800 pb-4">
          <div>
            <h2 className={`text-xl font-black uppercase leading-none ${isExistingClient ? 'text-amber-500' : 'text-indigo-600'}`}>
              {isExistingClient ? "ID Found" : "New Entry"}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest">{selectedDate}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Total Pending</p>
             <p className={`text-xl font-black mt-1 ${form.pendingTasks > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                {form.pendingTasks}
             </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-indigo-500 ml-1">Client ID</label>
              <input
                type="text"
                value={form.clientId}
                onChange={(e) => setForm({...form, clientId: e.target.value})}
                className="w-full p-3 mt-1 rounded-xl font-bold text-xs bg-white dark:bg-slate-900 border dark:border-slate-700 outline-none focus:ring-1 ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Manager</label>
              <select
                value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold text-xs outline-none"
              >
                {managerList.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description</label>
            <textarea
              rows="3"
              placeholder="Enter task details or notes..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold text-xs outline-none focus:ring-1 ring-indigo-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Image Link (Direct)</label>
            <input
              type="text"
              placeholder="Paste Image URL from Drive/Hosting"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold text-xs outline-none focus:ring-1 ring-indigo-500"
            />
          </div>

          <div>
            {/* ড্রাইভ লিঙ্ক ইনপুটে কমা ব্যবহারের নির্দেশ */}
            <label className="flex justify-between items-center ml-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Drive Links</span>
              <span className="text-[9px] text-indigo-400 font-bold italic lowercase">use comma (,) for multiple links</span>
            </label>
            <input
              type="text"
              placeholder="link1, link2, link3"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold text-xs outline-none focus:ring-1 ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className={`p-3 rounded-2xl text-center border bg-slate-50 dark:bg-slate-800/50`}>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">Quota</label>
              <p className="font-black text-lg text-indigo-600">10</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-2xl text-center border border-blue-100">
              <label className="text-[10px] font-black uppercase text-blue-500 block mb-1">Done</label>
              <input 
                type="number" 
                value={form.completeTasks} 
                onChange={(e) => setForm({ ...form, completeTasks: e.target.value })} 
                className="w-full bg-transparent text-center font-black text-base text-blue-600 outline-none" 
              />
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-2xl text-center border border-emerald-100">
              <label className="text-[10px] font-black uppercase text-emerald-500 block mb-1">Success</label>
              <input 
                type="number" 
                value={form.successCount} 
                onChange={(e) => setForm({ ...form, successCount: e.target.value })} 
                className="w-full bg-transparent text-center font-black text-base text-emerald-600 outline-none" 
              />
            </div>
          </div>

          <div className="pt-2">
            <button disabled={loading} onClick={submit} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:bg-slate-400">
              {loading ? "Processing..." : (isExistingClient ? "Update Design" : "Save Record")}
            </button>
            <button onClick={onClose} className="w-full mt-2 text-slate-400 text-[11px] font-black uppercase hover:text-rose-500 transition">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  ); 
}