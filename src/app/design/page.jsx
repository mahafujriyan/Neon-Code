"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import DesignTable from "@/components/designs/DesignTable";
import AddDesignModal from "@/components/designs/AddDesignModal";

export default function DesignDashboard() {
  const router = useRouter();
  const [designs, setDesigns] = useState([]);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [filterManager, setFilterManager] = useState("All");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const managerList = ["Abdullah GFX", "Redown", "Arko"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fUser) => {
      if (!fUser) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/users?email=${fUser.email}`);
      const userData = await res.json();
      setUser({ name: userData.name, email: fUser.email, role: userData.role });
      setRole(userData.role || "manager");
      loadData();
    });
    return () => unsub();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await fetch("/api/designs");
    const data = await res.json();
    setDesigns(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const currentMonth = selectedDate.substring(0, 7);

  // ১. ম্যানেজার ফিল্টার
  const managerData = designs.filter(d => 
    filterManager === "All" || d.managerName === filterManager
  );

  // ২. ক্যালকুলেশন লজিক (ডেইলি এবং মান্থলি)
  const calculateSmartStats = (data, isMonthly = false) => {
    const stats = data.reduce((acc, d) => {
      acc.c += Number(d.completeTasks || 0);
      acc.s += Number(d.successCount || 0);
      acc.r += Number(d.rejectCount || 0);
      return acc;
    }, { t: 0, c: 0, p: 0, s: 0, r: 0 });

    if (filterManager !== "All") {
      // যদি নির্দিষ্ট ম্যানেজার সিলেক্ট থাকে
      if (isMonthly) {
        // মান্থলি গিভেন টাস্ক = (এই মাসে যত দিন সে কাজ করেছে) * ১০
        const uniqueDays = [...new Set(data.map(d => d.submittedDate))].length;
        stats.t = uniqueDays * 10;
      } else {
        // ডেইলি গিভেন টাস্ক সবসময় ১০ (ফিক্সড)
        stats.t = 10;
      }
    } else {
      // যদি All Managers সিলেক্ট থাকে
      const totalManagers = managerList.length;
      if (isMonthly) {
        const uniqueDays = [...new Set(data.map(d => d.submittedDate))].length;
        stats.t = uniqueDays * totalManagers * 10;
      } else {
        stats.t = totalManagers * 10;
      }
    }

    // পেন্ডিং = মোট দেওয়া কাজ - মোট কমপ্লিট কাজ
    stats.p = stats.t - stats.c;
    return stats;
  };

  // ফিল্টার করা ডাটা সেট
  const dailyFiltered = managerData.filter(d => (d.submittedDate || d.createdAt?.split('T')[0]) === selectedDate);
  const monthlyFiltered = managerData.filter(d => (d.submittedDate || d.createdAt)?.startsWith(currentMonth));

  const dailyStats = calculateSmartStats(dailyFiltered, false);
  const monthlyStats = calculateSmartStats(monthlyFiltered, true);

  const handleBack = () => {
    if (role === "admin") router.push("/dashboard/admin");
    else router.push("/dashboard/manager");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-600 uppercase">Loading...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#020617]">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:scale-110 transition">⬅️</button>
          <div>
             <h1 className="text-xl font-black uppercase text-indigo-600 dark:text-indigo-400">Design Performance</h1>
             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Manager: {filterManager}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={filterManager} onChange={(e) => setFilterManager(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 font-bold text-[11px] shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-800">
            <option value="All">All Managers</option>
            {managerList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 font-bold text-[11px] shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-800" />
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase shadow-lg">+ New Design</button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Daily Stats */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
            <h3 className="text-[12px] font-black uppercase text-slate-400 mb-4 ml-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span> Daily: {selectedDate}
            </h3>
            <div className="grid grid-cols-5 gap-2">
                <StatBox label="Daily Limit" val={dailyStats.t} color="text-indigo-500" />
                <StatBox label="Done" val={dailyStats.c} color="text-blue-500" />
                <StatBox label="Pending" val={dailyStats.p} color="text-rose-500" />
                <StatBox label="Success" val={dailyStats.s} color="text-emerald-500" />
                <StatBox label="Reject" val={dailyStats.r} color="text-rose-500" />
            </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
            <h3 className="text-[12px] font-black uppercase text-slate-400 mb-4 ml-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> Monthly Summary
            </h3>
            <div className="grid grid-cols-5 gap-2">
                <StatBox label="Total Limit" val={monthlyStats.t} color="text-indigo-500" />
                <StatBox label="Total Done" val={monthlyStats.c} color="text-blue-500" />
                <StatBox label="Total Pend" val={monthlyStats.p} color="text-rose-500" />
                <StatBox label="Total Succ" val={monthlyStats.s} color="text-emerald-500" />
                <StatBox label="Total Rejc" val={monthlyStats.r} color="text-rose-500" />
            </div>
        </div>
      </div>

      {/* Description Section (আপনি যেটা চাইলেন) */}
      <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
        <h4 className="text-[11px] font-black uppercase text-indigo-500 mb-2">Manager Performance Review</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {filterManager === "All" 
            ? "Showing combined data for all managers. Each manager is assigned 10 tasks daily." 
            : `Currently viewing ${filterManager}'s performance. Out of the 10 daily assigned tasks, ${dailyStats.c} have been completed today with a success rate of ${dailyStats.c > 0 ? ((dailyStats.s / dailyStats.c) * 100).toFixed(1) : 0}%.`}
          {dailyStats.p > 0 ? ` There are still ${dailyStats.p} tasks pending for today.` : " All tasks for today have been completed!"}
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-2 shadow-xl border border-slate-100 dark:border-slate-800">
        <DesignTable designs={managerData} role={role} refresh={loadData} user={user} selectedDate={selectedDate} />
      </div>

      {showModal && (
        <AddDesignModal user={user} onClose={() => setShowModal(false)} refresh={loadData} selectedDate={selectedDate} designs={designs} />
      )}
    </div>
  );
}

function StatBox({ label, val, color }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-center border dark:border-slate-800 shadow-sm">
      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className={`text-sm md:text-base font-black ${color} tracking-tighter`}>{val}</p>
    </div>
  );
}