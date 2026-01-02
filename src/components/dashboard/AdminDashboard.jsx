// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { auth } from "@/lib/firebase"; 
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import AddOrderModal from "../AddFroms/AddOrderForms";
// import OrderTable from "./OrderTable";
// import Image from "next/image";
// import ServiceTypeChart from "./ServiceTypeChart";

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [orders, setOrders] = useState([]);
//   const [userRole, setUserRole] = useState(null); 
//   const [currentUser, setCurrentUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [authLoading, setAuthLoading] = useState(true);
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//  // ১. ইউজার অথেন্টিকেশন এবং রোল চেক এক সাথে
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (!user) {
//         router.push("/login");
//       } else {
//         const userEmail = user.email.toLowerCase().trim();
//         setCurrentUser(user);
        
//         try {
//           // রোল এবং ডাটা লোড করার রিকোয়েস্ট একসাথেই হ্যান্ডেল করা
//           const [roleRes, orderRes] = await Promise.all([
//             fetch(`/api/users?email=${userEmail}`),
//             fetch(`/api/orders?email=${userEmail}`)
//           ]);

//           const userData = await roleRes.json();
//           const orderData = await orderRes.json();

//           setUserRole(userData?.role || "manager");
//           setOrders(Array.isArray(orderData) ? orderData : []);
          
//         } catch (err) {
//           console.error("Initialization Error:", err);
//           setUserRole("manager");
//         } finally {
//           // সব কিছু শেষ হলে লোডার বন্ধ হবে
//           setAuthLoading(false);
//           setLoading(false);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   // ২. লোড ডাটা ফাংশন (যা বাটন বা এডিট শেষে কল হবে)
//   const loadData = async () => {
//     if (!auth.currentUser) return;
    
//     try {
//       setLoading(true);
//       const userEmail = auth.currentUser.email.toLowerCase().trim();
//       const res = await fetch(`/api/orders?email=${userEmail}`);
//       const data = await res.json();
//       setOrders(Array.isArray(data) ? data : []);
//     } catch (err) { 
//       console.error("Fetch error:", err); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   // ৩. লগআউট ফাংশন
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       router.push("/");
//     } catch (error) { 
//       console.error("Logout Error:", error); 
//     }
//   };

//   const calcStats = (data) => {
//     return data.reduce((acc, o) => {
//       const isUSD = Number(o.totalAmountUSD) > 0;
//       const amount = isUSD ? Number(o.totalAmountUSD) : (Number(o.taskCount) || 0);
//       const sellRate = Number(o.dollarRate) || 0;
//       const buyRate = Number(o.buyRate) || 0;
      
//       const revenue = amount * sellRate;
//       const profit = (sellRate - buyRate) * amount;
//       const paid = o.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0;

//       if (isUSD) acc.usdOnly += amount;
//       else acc.taskOnly += amount;

//       acc.totalRev += revenue;
//       acc.totalProfit += profit;
//       acc.totalPaid += paid;
//       acc.count += 1;
//       return acc;
//     }, { usdOnly: 0, taskOnly: 0, totalRev: 0, totalProfit: 0, totalPaid: 0, count: 0 });
//   };

//   const monthlyOrders = orders.filter(o => {
//     const d = new Date(o.orderDate || o.createdAt);
//     const now = new Date();
//     return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
//   });

//   const mStats = calcStats(monthlyOrders);
//   const tStats = calcStats(orders.filter(o => {
//     const d = new Date(o.orderDate || o.createdAt).toISOString().split('T')[0];
//     return d === selectedDate;
//   }));

//   if (authLoading || loading) return (
//     <div className="h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
//       <div className="flex flex-col items-center gap-4 text-indigo-600 font-black italic uppercase animate-pulse">
//         <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//         NeonCode Security Checking...
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#020617] text-gray-900 dark:text-white font-sans transition-all">
//       {/* TOP BAR */}
      

//       <div className="sticky top-0 z-50 mb-10 backdrop-blur-xl bg-white/80 dark:bg-[#020617]/90 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-4 md:p-5 shadow-xl">
//         <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
//           <div className="flex items-center gap-4 w-full lg:w-auto">
//             <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ">
//              <Image src="/company logo .jpg" alt="Logo" width={28} height={28}></Image>
//             </div>
            
//             <div>
//               <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">Admin Control Panel</h1>
//               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
//                 Total Records: {orders.length}
//               </p>
//             </div>
            
//           </div>
//           <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
//               <button
//           onClick={() => router.push("/dashboard/expense")}
//           className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 border-none px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase  shadow-lg active:scale-95 transition-all"
//         >
//          Expenses
//         </button>
//             <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-gray-200 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-[11px] font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all cursor-pointer shadow-sm dark:text-white" />
//             <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] shadow-lg active:scale-95 transition-all">+ Create Order</button>
//             <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
//                <span className="px-3 text-[9px] font-black uppercase text-indigo-500">{userRole}</span>
//                <button onClick={handleLogout} className="bg-rose-500 text-white px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all">Exit</button>
//             </div>
//           </div>
//         </div>
//       </div>
  
//       {/* STATS */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
//         {/* Monthly */}
//         <div className="bg-[#1e293b] dark:bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Monthly Summary</h3>
//                 <div className="px-3 py-1 bg-white/5 rounded-full text-[14px] font-bold text-indigo-300">Orders: {mStats.count}</div>
//             </div>
//             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//                 <StatBox label="Total USD ($)" val={`$${mStats.usdOnly.toLocaleString()}`} color="text-amber-400" />
//                 <StatBox label="Total Task (T)" val={`${mStats.taskOnly.toLocaleString()} T`} color="text-indigo-400" />
//                 <StatBox label="Net Profit ৳" val={`৳${mStats.totalProfit.toLocaleString()}`} color="text-emerald-400" isHighlight />
//                 <StatBox label="Revenue ৳" val={`৳${mStats.totalRev.toLocaleString()}`} />
//                 <StatBox label="Paid ৳" val={`৳${mStats.totalPaid.toLocaleString()}`} color="text-sky-400" />
//                 <StatBox label="Total Due ৳" val={`৳${(mStats.totalRev - mStats.totalPaid).toLocaleString()}`} color="text-rose-400" isWide />
//             </div>
//         </div>

//         {/* Daily */}
//         <div className="bg-[#0f172a] dark:bg-[#111827] rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
//             <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily Stats ({selectedDate})</h3>
//                 <div className="px-3 py-1 bg-white/5 rounded-full text-[14px] font-bold text-emerald-400">Day Orders: {tStats.count}</div>
//             </div>
//             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
//                 <StatBox label="Day USD ($)" val={`$${tStats.usdOnly.toLocaleString()}`} color="text-yellow-300" />
//                 <StatBox label="Day Task (T)" val={`${tStats.taskOnly.toLocaleString()} T`} color="text-indigo-300" />
//                 <StatBox label="Day Profit ৳" val={`৳${tStats.totalProfit.toLocaleString()}`} color="text-emerald-300" isHighlight />
//                 <StatBox label="Revenue ৳" val={`৳${tStats.totalRev.toLocaleString()}`} />
//                 <StatBox label="Paid ৳" val={`৳${tStats.totalPaid.toLocaleString()}`} color="text-sky-400" />
//                 <StatBox label="Day Due ৳" val={`৳${(tStats.totalRev - tStats.totalPaid).toLocaleString()}`} color="text-rose-400" isWide />
//             </div>
//         </div>
//       </div>
// {/* Typewise service */}
// <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-10">
//     <ServiceTypeChart orders={monthlyOrders} />
// </div>
//       {/* TABLE */}
//       <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
//         <OrderTable orders={orders} refresh={loadData} role={userRole} selectedDate={selectedDate} />
//       </div>

//       {showModal && <AddOrderModal onClose={() => setShowModal(false)} refresh={loadData} userEmail={currentUser?.email} />}
//     </div>
//   );
// }

// function StatBox({ label, val, color = "text-white", isHighlight = false, isWide = false }) {
//   return (
//     <div className={`${isWide ? 'col-span-2' : ''} ${isHighlight ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : 'bg-white/5'} p-4 rounded-2xl border border-white/5 shadow-inner`}>
//       <p className="text-[9px] opacity-50 uppercase font-black tracking-widest mb-1 truncate">{label}</p>
//       <p className={`text-lg md:text-xl font-black ${color} tracking-tighter`}>{val}</p>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import AddOrderModal from "../AddFroms/AddOrderForms";
import OrderTable from "./OrderTable";
import Image from "next/image";
import ServiceTypeChart from "./ServiceTypeChart";

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // --- নতুন ফিল্টার স্টেট (ম্যানেজার সিলেক্ট করার জন্য) ---
  const [filterManager, setFilterManager] = useState("All");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        const userEmail = user.email.toLowerCase().trim();
        setCurrentUser(user);
        
        try {
          const [roleRes, orderRes] = await Promise.all([
            fetch(`/api/users?email=${userEmail}`),
            fetch(`/api/orders?email=${userEmail}`)
          ]);

          const userData = await roleRes.json();
          const orderData = await orderRes.json();

          setUserRole(userData?.role || "manager");
          setOrders(Array.isArray(orderData) ? orderData : []);
          
        } catch (err) {
          console.error("Initialization Error:", err);
          setUserRole("manager");
        } finally {
          setAuthLoading(false);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const loadData = async () => {
    if (!auth.currentUser) return;
    
    try {
      setLoading(true);
      const userEmail = auth.currentUser.email.toLowerCase().trim();
      const res = await fetch(`/api/orders?email=${userEmail}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) { 
      console.error("Logout Error:", error); 
    }
  };

  const calcStats = (data) => {
    // এখানে ম্যানেজার ড্রপডাউন অনুযায়ী ডাটা ফিল্টার হচ্ছে
    const filteredByManager = filterManager === "All" 
      ? data 
      : data.filter(o => o.managerName === filterManager);

    return filteredByManager.reduce((acc, o) => {
      const isUSD = Number(o.totalAmountUSD) > 0;
      const amount = isUSD ? Number(o.totalAmountUSD) : (Number(o.taskCount) || 0);
      const sellRate = Number(o.dollarRate) || 0;
      const buyRate = Number(o.buyRate) || 0;
      
      const revenue = amount * sellRate;
      const profit = (sellRate - buyRate) * amount;
      const paid = o.payments?.reduce((sum, p) => sum + (Number(p.paidUSD) || 0), 0) || 0;

      if (isUSD) acc.usdOnly += amount;
      else acc.taskOnly += amount;

      acc.totalRev += revenue;
      acc.totalProfit += profit;
      acc.totalPaid += paid;
      acc.count += 1;
      return acc;
    }, { usdOnly: 0, taskOnly: 0, totalRev: 0, totalProfit: 0, totalPaid: 0, count: 0 });
  };

  const monthlyOrders = orders.filter(o => {
    const d = new Date(o.orderDate || o.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const mStats = calcStats(monthlyOrders);
  const tStats = calcStats(orders.filter(o => {
    const d = new Date(o.orderDate || o.createdAt).toISOString().split('T')[0];
    return d === selectedDate;
  }));

  if (authLoading || loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-[#020617]">
      <div className="flex flex-col items-center gap-4 text-indigo-600 font-black italic uppercase animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        NeonCode Security Checking...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#f8fafc] dark:bg-[#020617] text-gray-900 dark:text-white font-sans transition-all">
      {/* TOP BAR */}
      <div className="sticky top-0 z-50 mb-10 backdrop-blur-xl bg-white/80 dark:bg-[#020617]/90 border border-slate-200 dark:border-slate-800/60 rounded-3xl p-4 md:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg ">
              <Image src="/company logo .jpg" alt="Logo" width={28} height={28}></Image>
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter text-indigo-600 dark:text-indigo-400">Admin Control Panel</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Filtering: <span className="text-indigo-500">{filterManager}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
            {/* --- ম্যানেজার ফিল্টার ড্রপডাউন যোগ করা হয়েছে --- */}
            <select 
              value={filterManager}
              onChange={(e) => setFilterManager(e.target.value)}
              className="bg-gray-100 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-[11px] font-black uppercase text-indigo-600 outline-none ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm cursor-pointer"
            >
              <option value="All">All Managers</option>
              <option value="Sagor">Sagor</option>
              <option value="Shahed">Shahed</option>
              <option value="Mahafuj">Mahafuj</option>
              <option value="M Abdur Rahaman">M Abdur Rahaman</option>
              <option value="Iqbal">Iqbal</option>
              <option value="Abdullah Developer">Abdullah Developer</option>
              <option value="Abdullah Designer">Abdullah Designer</option>
              <option value="Redown">Redown</option>
            </select>

            <button onClick={() => router.push("/dashboard/expense")} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase shadow-lg active:scale-95 transition-all">Expenses</button>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-gray-200 dark:bg-slate-900 border-none px-4 py-2.5 rounded-xl text-[11px] font-bold outline-none ring-1 ring-slate-200 dark:ring-slate-800 transition-all cursor-pointer shadow-sm dark:text-white" />
            <button onClick={() => setShowModal(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold uppercase text-[10px] shadow-lg active:scale-95 transition-all">+ Create Order</button>
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-800">
               <span className="px-3 text-[9px] font-black uppercase text-indigo-500">{userRole}</span>
               <button onClick={handleLogout} className="bg-rose-500 text-white px-4 py-2 rounded-lg font-black uppercase text-[9px] transition-all">Exit</button>
            </div>
          </div>
        </div>
      </div>
  
      {/* STATS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Monthly Summary */}
        <div className="bg-[#1e293b] dark:bg-[#0f172a] rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monthly ({filterManager})</h3>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[14px] font-bold text-indigo-300">Orders: {mStats.count}</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatBox label="Total USD ($)" val={`$${mStats.usdOnly.toLocaleString()}`} color="text-amber-400" />
                <StatBox label="Total Task (T)" val={`${mStats.taskOnly.toLocaleString()} T`} color="text-indigo-400" />
                <StatBox label="Net Profit ৳" val={`৳${mStats.totalProfit.toLocaleString()}`} color="text-emerald-400" isHighlight />
                <StatBox label="Revenue ৳" val={`৳${mStats.totalRev.toLocaleString()}`} />
                <StatBox label="Paid ৳" val={`৳${mStats.totalPaid.toLocaleString()}`} color="text-sky-400" />
                <StatBox label="Total Due ৳" val={`৳${(mStats.totalRev - mStats.totalPaid).toLocaleString()}`} color="text-rose-400" isWide />
            </div>
        </div>

        {/* Daily Stats */}
        <div className="bg-[#0f172a] dark:bg-[#111827] rounded-[2.5rem] p-8 text-white shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Daily ({filterManager})</h3>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[14px] font-bold text-emerald-400">Day Orders: {tStats.count}</div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatBox label="Day USD ($)" val={`$${tStats.usdOnly.toLocaleString()}`} color="text-yellow-300" />
                <StatBox label="Day Task (T)" val={`${tStats.taskOnly.toLocaleString()} T`} color="text-indigo-300" />
                <StatBox label="Day Profit ৳" val={`৳${tStats.totalProfit.toLocaleString()}`} color="text-emerald-300" isHighlight />
                <StatBox label="Revenue ৳" val={`৳${tStats.totalRev.toLocaleString()}`} />
                <StatBox label="Paid ৳" val={`৳${tStats.totalPaid.toLocaleString()}`} color="text-sky-400" />
                <StatBox label="Day Due ৳" val={`৳${(tStats.totalRev - tStats.totalPaid).toLocaleString()}`} color="text-rose-400" isWide />
            </div>
        </div>
      </div>

      {/* Typewise service */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-10">
          <ServiceTypeChart orders={filterManager === "All" ? monthlyOrders : monthlyOrders.filter(o => o.managerName === filterManager)} />
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800/60 overflow-hidden">
        <OrderTable 
          orders={filterManager === "All" ? orders : orders.filter(o => o.managerName === filterManager)} 
          refresh={loadData} 
          role={userRole} 
          selectedDate={selectedDate} 
        />
      </div>

      {showModal && <AddOrderModal onClose={() => setShowModal(false)} refresh={loadData} userEmail={currentUser?.email} />}
    </div>
  );
}

function StatBox({ label, val, color = "text-white", isHighlight = false, isWide = false }) {
  return (
    <div className={`${isWide ? 'col-span-2' : ''} ${isHighlight ? 'bg-indigo-500/10 ring-1 ring-indigo-500/30' : 'bg-white/5'} p-4 rounded-2xl border border-white/5 shadow-inner`}>
      <p className="text-[9px] opacity-50 uppercase font-black tracking-widest mb-1 truncate">{label}</p>
      <p className={`text-lg md:text-xl font-black ${color} tracking-tighter`}>{val}</p>
    </div>
  );
}