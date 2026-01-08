"use client";
import { useState, useEffect } from "react";

export default function AddDesignModal({ onClose, refresh, user, editData = null }) {
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    managerName: user?.name || "Sagor",
    clientName: "",
    description: "", 
    workStatus: "Pending",
    totalTasks: 0,
    completeTasks: 0,
    successCount: 0,
    pendingTasks: 0,
    rejectCount: 0,
    imageFile: null, 
  });

  const managerList = [
    "Sagor", "Shahed", "Mahafuj", "M Abdur Rahaman", 
    "Iqbal", "Abdullah Developer", "Abdullah Designer", 
    "Redown", "Arko"
  ];

  // ডাটা লোড করা (এডিট মোডের জন্য)
  useEffect(() => {
    if (editData) {
      setForm({
        managerName: editData.managerName || "Sagor",
        clientName: editData.clientName || "",
        description: editData.description || "",
        workStatus: editData.workStatus || "Pending",
        totalTasks: editData.totalTasks || 0,
        completeTasks: editData.completeTasks || 0,
        successCount: editData.successCount || 0,
        pendingTasks: editData.pendingTasks || 0,
        rejectCount: editData.rejectCount || 0,
        imageFile: null,
      });
    }
  }, [editData]);

  // অটো ক্যালকুলেশন লজিক
  useEffect(() => {
    const total = Number(form.totalTasks) || 0;
    const complete = Number(form.completeTasks) || 0;
    const success = Number(form.successCount) || 0;

    setForm(prev => ({ 
      ...prev, 
      pendingTasks: total - complete,
      rejectCount: complete - success 
    }));
  }, [form.totalTasks, form.completeTasks, form.successCount]);

  const handleUpload = async () => {
    if (!form.imageFile) return editData?.designImage || null;
    const formData = new FormData();
    formData.append("image", form.imageFile);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.success ? data.data.url : null;
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  };

  const submit = async () => {
    if (!form.clientName) return alert("Client name is required");
    if (!editData && !form.imageFile) return alert("Please select a design image");
    
    setLoading(true);
    const imageUrl = await handleUpload();
    
    // ডাটা ক্লিন করে সঠিক প্রোপার্টি নেম সহ পাঠানো
    const payload = {
      id: editData?._id,
      managerName: form.managerName,
      managerEmail: user?.email || editData?.managerEmail,
      clientName: form.clientName,
      description: form.description,
      workStatus: form.workStatus,
      totalTasks: Number(form.totalTasks),
      completeTasks: Number(form.completeTasks),
      pendingTasks: Number(form.pendingTasks),
      successCount: Number(form.successCount),
      rejectCount: Number(form.rejectCount),
      designImage: imageUrl,
    };

    try {
      const res = await fetch("/api/designs", {
        method: editData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        refresh();
        onClose();
      } else {
        alert("Action failed!");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 text-left">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-black uppercase mb-6 dark:text-white border-b dark:border-slate-800 pb-4 text-indigo-600">
          {editData ? "Update Design Entry" : "Create Design Entry"}
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Select Manager</label>
              <select 
                value={form.managerName}
                onChange={(e) => setForm({...form, managerName: e.target.value})}
                className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs ring-1 ring-slate-200"
              >
                {managerList.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Work Status</label>
               <select 
                value={form.workStatus}
                onChange={(e) => setForm({...form, workStatus: e.target.value})}
                className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold dark:text-white text-xs"
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Complete">Complete</option>
              </select>
            </div>
          </div>

          <div>
             <label className="text-[10px] font-black uppercase text-indigo-500 ml-1">Client Name</label>
             <input 
               type="text"
               placeholder="Enter Client Name"
               value={form.clientName}
               onChange={(e) => setForm({...form, clientName: e.target.value})}
               className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs"
             />
          </div>

          {/* Description Field */}
          <div>
             <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Description</label>
             <textarea 
               placeholder="Briefly describe the design task..."
               value={form.description}
               onChange={(e) => setForm({...form, description: e.target.value})}
               className="w-full p-3 mt-1 bg-white dark:bg-slate-900 border dark:border-slate-700 rounded-xl font-bold outline-none dark:text-white text-xs min-h-[80px]"
             />
          </div>

          <div className="grid grid-cols-3 gap-3">
             <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-xl text-center">
                <label className="text-[9px] font-black uppercase text-slate-500">Total Task</label>
                <input 
                  type="number" 
                  value={form.totalTasks} 
                  onChange={(e)=>setForm({...form, totalTasks: e.target.value})} 
                  className="w-full bg-transparent text-center font-black outline-none text-sm dark:text-white" 
                />
             </div>
             <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl text-center ring-1 ring-blue-200">
                <label className="text-[9px] font-black uppercase text-blue-500">Complete</label>
                <input 
                  type="number" 
                  value={form.completeTasks} 
                  onChange={(e)=>setForm({...form, completeTasks: e.target.value})} 
                  className="w-full bg-transparent text-center font-black outline-none text-sm text-blue-600" 
                />
             </div>
             <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-xl text-center ring-1 ring-amber-200">
                <label className="text-[9px] font-black uppercase text-amber-500">Pending</label>
                <input 
                  type="number" 
                  value={form.pendingTasks} 
                  readOnly 
                  className="w-full bg-transparent text-center font-black outline-none text-sm text-amber-600" 
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl text-center ring-1 ring-emerald-200">
                <label className="text-[9px] font-black uppercase text-emerald-500">Success</label>
                <input 
                  type="number" 
                  value={form.successCount} 
                  onChange={(e)=>setForm({...form, successCount: e.target.value})} 
                  className="w-full bg-transparent text-center font-black outline-none text-sm text-emerald-600" 
                />
             </div>
             <div className="bg-rose-50 dark:bg-rose-900/20 p-2 rounded-xl text-center ring-1 ring-rose-200">
                <label className="text-[9px] font-black uppercase text-rose-500">Reject</label>
                <input 
                  type="number" 
                  value={form.rejectCount} 
                  readOnly 
                  className="w-full bg-transparent text-center font-black outline-none text-sm text-rose-600" 
                />
             </div>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/30">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setForm({...form, imageFile: e.target.files[0]})}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-600 file:text-white cursor-pointer"
            />
          </div>

          <button 
            disabled={loading}
            onClick={submit}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : editData ? "Update Record" : "Save Record"}
          </button>
          
          <button onClick={onClose} className="w-full text-slate-400 text-[10px] font-black uppercase mt-2 hover:text-rose-500 transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}