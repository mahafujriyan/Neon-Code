"use client";
import { useState } from "react";
import AddDesignModal from "./AddDesignModal";

export default function DesignTable({ designs, role, refresh, user }) {
  const [preview, setPreview] = useState(null);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  // ১. সার্চ লজিক ফিক্স করা হয়েছে (Optional Chaining ব্যবহার করে)
  const filteredData = (designs || []).filter((d) =>
    (d?.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
    (d?.managerName || "").toLowerCase().includes(search.toLowerCase())
  );

  const approve = async (id) => {
    try {
      const res = await fetch("/api/designs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved", approvedBy: user.email }),
      });
      if (res.ok) refresh();
    } catch (err) {
      console.error("Approve error", err);
    }
  };

  const remove = async (id) => {
    if (confirm("Delete this record?")) {
      try {
        await fetch(`/api/designs?id=${id}`, { method: "DELETE" });
        refresh();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* সার্চ বার */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by Client or Manager..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="overflow-x-auto rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] shadow-xl">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest">
            <tr>
              <th className="p-5">Submitted At</th>
              <th className="p-5">Manager</th>
              <th className="p-5">Client Name / Desc</th>
              <th className="p-5 text-center">T / C / P / S / R</th>
              <th className="p-5 text-center">Design</th>
              <th className="p-5 text-center">Admin Status</th>
              <th className="p-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredData.map((d) => (
              <tr key={d._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                {/* ২. ডেট লজিক ফিক্সড */}
                <td className="p-5">
                  <div className="font-bold dark:text-white leading-tight">
                    {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "N/A"}
                  </div>
                  <div className="text-[10px] text-slate-400 italic font-medium">
                    {d.createdAt ? new Date(d.createdAt).toLocaleTimeString() : ""}
                  </div>
                </td>

                <td className="p-5">
                  <div className="font-bold dark:text-slate-200 text-indigo-600 uppercase tracking-tight">{d.managerName || "Unknown"}</div>
                  <div className="text-[10px] text-slate-400 font-medium lowercase">{d.managerEmail || "N/A"}</div>
                </td>

                <td className="p-5">
                  <div className="font-black text-slate-700 dark:text-slate-300 uppercase text-[11px] bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg inline-block mb-1">
                    {/* ৩. ক্লায়েন্ট নেম ডিসপ্লে ফিক্সড */}
                    {d.clientName || "Unknown Client"}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{d.description || "No description"}</p>
                </td>

                <td className="p-5 text-center">
                  <div className="flex gap-1 justify-center font-black text-[11px]">
                    {/* ৪. টোটাল/পেন্ডিং ডাটা টাইপ ফিক্সড (Null check সহ) */}
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">T:{d.totalTasks ?? 0}</span>
                    <span className="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-600">C:{d.completeTasks ?? 0}</span>
                    <span className="bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded text-amber-600">P:{d.pendingTasks ?? 0}</span>
                    <span className="bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded text-emerald-600">S:{d.successCount ?? 0}</span>
                    <span className="bg-rose-50 dark:bg-rose-900/30 px-2 py-1 rounded text-rose-600">R:{d.rejectCount ?? 0}</span>
                  </div>
                </td>

                <td className="p-5 text-center">
                  <button onClick={() => setPreview(d.designImage)} className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all mx-auto flex items-center justify-center">
                    👁️
                  </button>
                </td>

                <td className="p-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${d.status === "approved" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                    {d.status || "pending"}
                  </span>
                </td>

                <td className="p-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditData(d)} 
                      className="px-3 py-2 bg-amber-500 text-white text-[9px] font-black rounded-xl uppercase shadow-lg hover:bg-amber-600 transition"
                    >
                      Edit
                    </button>
                    {role === "admin" && (
                      <>
                        {d.status === "pending" && (
                          <button onClick={() => approve(d._id)} className="px-3 py-2 bg-indigo-600 text-white text-[9px] font-black rounded-xl uppercase shadow-lg">Approve</button>
                        )}
                        <button onClick={() => remove(d._id)} className="px-3 py-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 text-[9px] font-black rounded-xl uppercase">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <AddDesignModal 
          editData={editData} 
          onClose={() => setEditData(null)} 
          refresh={refresh} 
          user={user}
        />
      )}

      {/* ইমেজ প্রিভিউ সেকশন */}
      {preview && (
        <div className="fixed inset-0 bg-slate-950/90 z-[999] flex items-center justify-center p-4 backdrop-blur-md" onClick={() => setPreview(null)}>
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 p-2 rounded-[2.5rem] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full font-bold text-xl flex items-center justify-center" onClick={() => setPreview(null)}>&times;</button>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center bg-slate-100 dark:bg-slate-950 rounded-[2rem]">
              <img src={preview} className="max-w-full h-auto object-contain" alt="Design Preview" />
            </div>
            <div className="p-4 flex justify-between items-center px-8 bg-white dark:bg-slate-900">
              <h4 className="text-[11px] font-black uppercase text-indigo-600">High Quality Design Preview</h4>
              <a href={preview} target="_blank" rel="noreferrer" className="bg-indigo-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase">Open Original</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}