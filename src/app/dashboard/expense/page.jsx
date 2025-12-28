"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ExpenseDashboard from "@/components/expense/ExpenseDashboard";



export default function ExpensePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }

      try {
        const email = firebaseUser.email.toLowerCase().trim();
        const res = await fetch(`/api/users?email=${email}`);
        const data = await res.json();

        setUser({
          name: data.name || firebaseUser.displayName || "User",
          email,
        });
        setRole(data.role || "manager");
      } catch (err) {
        console.error("User load error", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  const handleBack = () => {
    if (role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/manager");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-indigo-600 font-black animate-pulse">
          Loading Expense Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#f8fafc] dark:bg-[#020617] text-slate-900 dark:text-white">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-indigo-600 dark:text-indigo-400">
            Expense Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            General Expenses & Employee-wise Expenses
          </p>
        </div>

        {/* 🔙 BACK BUTTON */}
       <button
  onClick={handleBack}
  className="group inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl 
             bg-slate-900 text-white text-xs font-black uppercase 
             hover:bg-indigo-600 transition-all shadow-lg"
>
  {/* ICON */}
  <span className="flex items-center justify-center w-8 h-8 rounded-xl 
                   bg-white/10 group-hover:bg-white/20 transition">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="3"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 19l-7-7 7-7M3 12h18"
      />
    </svg>
  </span>

  {/* TEXT */}
  Back to Dashboard
</button>
      </div>

      {/* ===== DASHBOARD ===== */}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <ExpenseDashboard user={user} role={role} />
      </div>
    </div>
  );
}
