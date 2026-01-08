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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fUser) => {
      if (!fUser) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/users?email=${fUser.email}`);
      const userData = await res.json();
      setUser({ name: userData.name, email: fUser.email });
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

  // ১. Daily Stats (সিলেক্ট করা তারিখ অনুযায়ী ফিল্টার)
  const dailyFiltered = designs.filter(d => 
    d.submittedDate === selectedDate && 
    (filterManager === "All" || d.managerName === filterManager)
  );

  // ২. Monthly Stats (সিলেক্ট করা মাসের সব ডাটা ফিল্টার)
  const monthlyFiltered = designs.filter(d => 
    d.submittedDate?.startsWith(currentMonth) && 
    (filterManager === "All" || d.managerName === filterManager)
  );

  const calculateStats = (data) => data.reduce((acc, d) => {
    acc.t += Number(d.totalTasks || 0);
    acc.c += Number(d.completeTasks || 0);
    acc.p += Number(d.pendingTasks || 0);
    acc.s += Number(d.successCount || 0);
    acc.r += Number(d.rejectCount || 0);
    return acc;
  }, { t: 0, c: 0, p: 0, s: 0, r: 0 });

  const dailyStats = calculateStats(dailyFiltered);
  const monthlyStats = calculateStats(monthlyFiltered);

  const handleBack = () => {
    if (role === "admin") router.push("/admin");
    else router.push("/manager");
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-600 tracking-widest">LOADING DESIGN DATA...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#020617]">
      
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:scale-110 transition">⬅️</button>
          <h1 className="text-xl font-black uppercase text-indigo-600 dark:text-indigo-400">Design Performance</h1>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <select 
            value={filterManager} 
            onChange={(e) => setFilterManager(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-none font-bold text-[11px] shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-800"
          >
            <option value="All">All Managers</option>
            {["Sagor", "Shahed", "Mahafuj", "M Abdur Rahaman", "Iqbal", "Abdullah Developer", "Abdullah Designer", "Redown", "Arko"].map(m => (
                <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border-none font-bold text-[11px] shadow-sm outline-none ring-1 ring-slate-200 dark:ring-slate-800"
          />

          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[12px] uppercase shadow-lg hover:bg-indigo-700 transition"
          >
            + New Design
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Daily Stats Section */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
            <h3 className="text-[16px] font-black uppercase text-slate-400 mb-4 ml-2 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span> Daily Summary ({selectedDate})
            </h3>
            <div className=" text-[16px] grid grid-cols-5 gap-2">
                <StatBox label="Total" val={dailyStats.t} color="text-slate-500" />
                <StatBox label="Comp" val={dailyStats.c} color="text-blue-500" />
                <StatBox label="Pend" val={dailyStats.p} color="text-amber-500" />
                <StatBox label="Succ" val={dailyStats.s} color="text-emerald-500" />
                <StatBox label="Rejc" val={dailyStats.r} color="text-rose-500" />
            </div>
        </div>

        {/* Monthly Stats Section */}
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-800">
            <h3 className="text-[14px] font-black uppercase text-slate-400 mb-4 ml-2 tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span> Monthly Summary ({currentMonth})
            </h3>
            <div className="  grid grid-cols-5 gap-2">
                <StatBox label="Total" val={monthlyStats.t} color="text-slate-500" />
                <StatBox label="Comp" val={monthlyStats.c} color="text-blue-500" />
                <StatBox label="Pend" val={monthlyStats.p} color="text-amber-500" />
                <StatBox label="Succ" val={monthlyStats.s} color="text-emerald-500" />
                <StatBox label="Rejc" val={monthlyStats.r} color="text-rose-500" />
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-2 shadow-xl border border-slate-100 dark:border-slate-800">
        <DesignTable 
          designs={designs.filter(d => filterManager === "All" || d.managerName === filterManager)} 
          role={role} 
          refresh={loadData} 
          user={user} 
        />
      </div>

      {showModal && <AddDesignModal user={user} onClose={() => setShowModal(false)} refresh={loadData} />}
    </div>
  );
}

function StatBox({ label, val, color }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-center border dark:border-slate-800 shadow-sm ring-1 ring-slate-100 dark:ring-transparent">
      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className={`text-sm font-black ${color} tracking-tighter`}>{val}</p>
    </div>
  );
}