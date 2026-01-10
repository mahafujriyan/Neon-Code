"use client";
import { useState } from "react";
import AddDesignModal from "./AddDesignModal";

export default function DesignTable({ designs = [], role, refresh, user, selectedDate }) {
  const [editData, setEditData] = useState(null);
  const [filterMode, setFilterMode] = useState("daily");
  const [search, setSearch] = useState("");

  const getLocalDate = (dateInput) => {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    return d.toISOString().split('T')[0]; 
  };

  const getTime = (dateInput) => {
    if (!dateInput) return "";
    return new Date(dateInput).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentMonthStr = selectedDate.substring(0, 7);

  let filteredData = designs.filter((d) => {
    const itemDate = d.submittedDate || getLocalDate(d.createdAt);
    if (filterMode === "daily") {
      return itemDate === selectedDate;
    } else {
      return itemDate.startsWith(currentMonthStr);
    }
  });

  if (search) {
    filteredData = filteredData.filter((d) =>
      (d?.clientId || "").toLowerCase().includes(search.toLowerCase())
    );
  }

  const openLink = (link) => {
    if (link && link.trim()) window.open(link.trim(), "_blank");
    else alert("No link found!");
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
      {/* কন্ট্রোল বার */}
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

      {/* ডিজাইন টেবিল */}
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
                <th className="p-6">Folder & Images</th>
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
                    <div className="text-indigo-600 uppercase text-[14px] leading-none">{d.managerName}</div>
                    <div className="text-[10px] text-slate-400 mt-1 lowercase font-medium">{d.managerEmail || "no-email@found.com"}</div>
                  </td>
                  <td className="p-6">
                    <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[11px] dark:text-slate-300">
                      ID: {d.clientId}
                    </span>
                  </td>
                  <td className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Folder Section */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase text-slate-400">Folder</span>
                          <button 
                            onClick={() => openLink(d.folderLink || d.imageUrl)} 
                            className={`p-2 rounded-lg transition-all ${(d.folderLink || d.imageUrl) ? 'bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white' : 'bg-slate-100 text-slate-300 '}`}
                            title="Open Link"
                          >
                            📂
                          </button>
                        </div>
                        
                             {/* Images Section */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] uppercase text-slate-400">Images</span>
                          <div className="flex gap-1">
                            {d.driveLink ? d.driveLink.split(',').map((link, idx) => (
                              <button 
                                key={idx}
                                onClick={() => openLink(link)} 
                                className="p-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white text-indigo-600 rounded-lg transition-all text-sm border border-indigo-100 dark:border-indigo-800"
                                title={`View Image ${idx + 1}`}
                              >
                                👁️
                              </button>
                            )) : (
                              <span className="text-[10px] text-slate-300">None</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                                      <td className="p-6">
                    <div className="flex gap-1 justify-center text-[13px] font-black">
                      <span className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded min-w-[40px] text-center" title="Given">G:{d.totalTasks}</span>
                      <span className="bg-blue-50 text-blue-600 p-1.5 rounded min-w-[40px] text-center" title="Complete">C:{d.completeTasks}</span>
                      <span className={`p-1.5 rounded min-w-[40px] text-center ${d.pendingTasks > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`} title="Pending">P:{d.pendingTasks}</span>
                      <span className="bg-emerald-50 text-emerald-600 p-1.5 rounded min-w-[40px] text-center" title="Success">S:{d.successCount}</span>
                      <span className="bg-rose-50 text-rose-600 p-1.5 rounded min-w-[40px] text-center" title="Reject">R:{d.rejectCount}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2 items-center">
                      <button onClick={() => setEditData(d)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] uppercase font-black">
                        Edit
                      </button>
                      {role === "admin" && (
                        <button onClick={() => remove(d._id)} className="bg-rose-500 text-white px-4 py-2 rounded-xl text-[11px] uppercase font-black">
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

      {editData && (
        <AddDesignModal 
          editData={editData} 
          onClose={() => setEditData(null)} 
          refresh={refresh} 
          user={user} 
          selectedDate={editData.submittedDate || selectedDate}
          designs={designs} 
        />
      )}
    </div>
  );
}