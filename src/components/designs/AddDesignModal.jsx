"use client";
import { useState, useEffect } from "react";

export default function AddDesignModal({ onClose, refresh, user, editData = null }) {
  const [loading, setLoading] = useState(false);
  const [isExistingClient, setIsExistingClient] = useState(false);

  // ১. Given Task ডিফল্ট ১০ সেট করা হয়েছে
  const [form, setForm] = useState({
    managerName: user?.name || "Abdullah GFX",
    managerEmail: user?.email || "",
    clientId: "CL-", 
    description: "",
    driveLink: "",
    totalTasks: 10, 
    completeTasks: 0,
    successCount: 0,
    pendingTasks: 10,
    rejectCount: 0,
  });

  const managerList = ["Abdullah GFX", "Redown", "Arko"];

  useEffect(() => {
    if (editData) {
      setForm({ ...editData });
      setIsExistingClient(true);
    }
  }, [editData]);

  const handleIdLookup = async (id) => {
    if (!id.startsWith("CL-")) {
      id = "CL-" + id.replace("CL-", "");
    }
    setForm((prev) => ({ ...prev, clientId: id }));

    if (id.length > 4) {
      try {
        const res = await fetch(`/api/designs?clientId=${id}`);
        const data = await res.json();
        
        if (data && data._id) {
          setForm({
            ...data,
            clientId: id, 
          });
          setIsExistingClient(true);
        } else {
          setIsExistingClient(false);
        }
      } catch (err) {
        console.error("Lookup error");
      }
    }
  };

  useEffect(() => {
    const total = Number(form.totalTasks) || 0;
    const complete = Number(form.completeTasks) || 0;
    const success = Number(form.successCount) || 0;

    setForm((prev) => ({
      ...prev,
      pendingTasks: total - complete,
      rejectCount: complete - success,
    }));
  }, [form.totalTasks, form.completeTasks, form.successCount]);

  const submit = async () => {
    if (form.clientId === "CL-" || form.clientId.length < 4) return alert("Please enter a valid Client ID!");
    if (!form.driveLink) return alert("Drive Link is required!");

    setLoading(true);

    // ২. ম্যানেজার নেম এবং ডাটা সঠিকভাবে ব্যাকএন্ডে পাঠানোর জন্য পেলোড তৈরি
    const payload = {
      ...form,
      id: editData?._id || (isExistingClient ? form._id : undefined),
      managerName: form.managerName, // সরাসরি স্টেট থেকে ভ্যালু নেওয়া হচ্ছে
      managerEmail: user?.email || form.managerEmail,
      totalTasks: Number(form.totalTasks),
      completeTasks: Number(form.completeTasks),
      successCount: Number(form.successCount),
      pendingTasks: Number(form.pendingTasks),
      rejectCount: Number(form.rejectCount),
    };

    try {
      const res = await fetch("/api/designs", {
        method: (editData || isExistingClient) ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        refresh();
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Action failed!");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto transition-all">
        <h2 className="text-xl font-black uppercase mb-6 dark:text-white border-b dark:border-slate-800 pb-4 text-indigo-600 flex justify-between items-center">
          <span>{editData ? "Edit Design" : (isExistingClient ? "Update Client Record" : "New Entry")}</span>
          {isExistingClient && <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">CLIENT DETECTED</span>}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-indigo-500 ml-1">Client Unique ID</label>
              <input
                type="text"
                disabled={isExistingClient} 
                value={form.clientId}
                onChange={(e) => handleIdLookup(e.target.value)}
                className={`w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs ${isExistingClient ? 'opacity-60 cursor-not-allowed border-emerald-500' : 'focus:ring-1 focus:ring-indigo-500'}`}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Manager Name</label>
              <select
                value={form.managerName}
                onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold dark:text-white text-xs outline-none"
              >
                {managerList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Drive Link (URL)</label>
            <input
              type="url"
              value={form.driveLink}
              onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
              className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs h-20"
            />
          </div>

          {/* Calculation Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl text-center border dark:border-slate-700">
              <label className="text-[9px] font-black uppercase text-slate-400">Given Task</label>
              <input
                type="number"
                value={form.totalTasks}
                onChange={(e) => setForm({ ...form, totalTasks: e.target.value })}
                className="w-full bg-transparent text-center font-black outline-none text-sm dark:text-white"
              />
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/10 p-2 rounded-xl text-center border border-blue-100 dark:border-blue-900/20">
              <label className="text-[9px] font-black uppercase text-blue-500">Complete</label>
              <input
                type="number"
                value={form.completeTasks}
                onChange={(e) => setForm({ ...form, completeTasks: e.target.value })}
                className="w-full bg-transparent text-center font-black outline-none text-sm text-blue-600"
              />
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/10 p-2 rounded-xl text-center border border-amber-100 dark:border-amber-900/20">
              <label className="text-[9px] font-black uppercase text-amber-500">Pending</label>
              <input type="number" value={form.pendingTasks} readOnly className="w-full bg-transparent text-center font-black text-sm text-amber-600 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-2">
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-2 rounded-xl text-center border border-emerald-100 dark:border-emerald-900/20">
              <label className="text-[9px] font-black uppercase text-emerald-500">Success</label>
              <input
                type="number"
                value={form.successCount}
                onChange={(e) => setForm({ ...form, successCount: e.target.value })}
                className="w-full bg-transparent text-center font-black outline-none text-sm text-emerald-600"
              />
            </div>
            <div className="bg-rose-50 dark:bg-rose-900/10 p-2 rounded-xl text-center border border-rose-100 dark:border-rose-900/20">
              <label className="text-[9px] font-black uppercase text-rose-500">Reject</label>
              <input type="number" value={form.rejectCount} readOnly className="w-full bg-transparent text-center font-black text-sm text-rose-600 outline-none" />
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <button
              disabled={loading}
              onClick={submit}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50 ${isExistingClient ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
            >
              {loading ? "Saving..." : (isExistingClient ? "Update Client Data" : "Save Design")}
            </button>
            <button onClick={onClose} className="w-full text-slate-400 text-[10px] font-black uppercase hover:text-rose-500 transition">
              Discard changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}