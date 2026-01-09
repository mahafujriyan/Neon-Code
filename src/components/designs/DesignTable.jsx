"use client";
import { useState } from "react";
import AddDesignModal from "./AddDesignModal";

export default function DesignTable({ designs = [], role, refresh, user, selectedDate }) {
  const [editData, setEditData] = useState(null);
  const [filterMode, setFilterMode] = useState("daily");
  const [search, setSearch] = useState("");

  // ১. তারিখ ফরম্যাট করার ফাংশন
  const getLocalDate = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toISOString().split('T')[0]; 
  };

  // ২. টাইম ফরম্যাট করার ফাংশন
  const getTime = (dateInput) => {
    if (!dateInput) return "";
    return new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentMonthStr = selectedDate.substring(0, 7); // YYYY-MM

  // ৩. ফিল্টারিং লজিক (Daily/Monthly)
  let filteredData = designs.filter((d) => {
    const itemDate = d.submittedDate || getLocalDate(d.createdAt);
    if (filterMode === "daily") {
      return itemDate === selectedDate;
    } else {
      return itemDate.startsWith(currentMonthStr);
    }
  });

  // ৪. সার্চ ফিল্টার
  if (search) {
    filteredData = filteredData.filter((d) =>
      (d?.clientId || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  // ড্রাইভ ইমেজ দেখার ফাংশন
  const viewImage = (link) => {
    if (link) {
      window.open(link, "_blank");
    } else {
      alert("No image link found for this design!");
    }
  };

  const remove = async (id) => {
    if (confirm("Are you sure you want to delete this?")) {
      try {
        await fetch(`/api/designs?id=${id}`, { method: "DELETE" });
        refresh();
      } catch (err) {
        console.error("Delete error", err);
      }
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ৫. কন্ট্রোল বার: Daily/Monthly সুইচ এবং সার্চ বার */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap gap-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button 
            onClick={() => setFilterMode("daily")} 
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${filterMode === "daily" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500"}`}
          >
            Daily View
          </button>
          <button 
            onClick={() => setFilterMode("monthly")} 
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${filterMode === "monthly" ? "bg-indigo-600 text-white shadow-md" : "text-slate-500"}`}
          >
            Monthly View
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search Client ID..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold focus:border-indigo-500 outline-none transition-all dark:text-white" 
          />
        </div>
      </div>

      {/* ৬. ডিজাইন টেবিল */}
      <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl bg-white dark:bg-[#020617]">
        {!filteredData.length ? (
          <div className="p-20 text-center">
            <p className="text-slate-400 uppercase text-[15px] font-black">No Records Found</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 text-[12px] uppercase font-black border-b border-slate-100 dark:border-slate-800">
                <th className="p-6">Date & Time</th>
                <th className="p-6">Manager Details</th>
                <th className="p-6">Client ID</th>
                <th className="p-6 text-center">Tasks (G/C/P/S/R)</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredData.map((d) => (
                <tr key={d._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all font-bold">
                  <td className="p-6">
                    <div className="text-slate-900 dark:text-white font-black">{d.submittedDate || getLocalDate(d.createdAt)}</div>
                    <div className="text-[10px] text-slate-400">{getTime(d.createdAt)}</div>
                  </td>
                  <td className="p-6">
                    <div className="text-indigo-600 uppercase text-[14px]">{d.managerName}</div>
                  </td>
                  <td className="p-6">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[11px] dark:text-slate-300">
                      ID: {d.clientId}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="flex gap-1 justify-center text-[10px] font-black">
                      <span className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded min-w-[35px] text-center">G:{d.totalTasks}</span>
                      <span className="bg-blue-50 text-blue-600 p-1.5 rounded min-w-[35px] text-center">C:{d.completeTasks}</span>
                      <span className="bg-amber-50 text-amber-600 p-1.5 rounded min-w-[35px] text-center">P:{d.pendingTasks}</span>
                      <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded min-w-[35px] text-center">S:{d.successCount}</span>
                      <span className="bg-rose-50 text-rose-600 p-1.5 rounded min-w-[35px] text-center">R:{d.rejectCount}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3 items-center">
                      <button 
                        onClick={() => viewImage(d.driveLink || d.imageLink)} 
                        title="View Design"
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 rounded-xl transition-all shadow-sm"
                      >
                        👁️
                      </button>

                      <button onClick={() => setEditData(d)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] uppercase font-black hover:bg-indigo-700 transition shadow-md">
                        Edit
                      </button>
                      
                      {role === "admin" && (
                        <button onClick={() => remove(d._id)} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[11px] uppercase font-black hover:bg-rose-600 transition shadow-md">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editData && <AddDesignModal editData={editData} onClose={() => setEditData(null)} refresh={refresh} user={user} />}
    </div>
  );
}