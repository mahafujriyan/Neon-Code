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
      <h1 className="text-2xl font-black uppercase tracking-tight text-indigo-600 dark:text-indigo-400">
        Expense Management
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        General Expenses & Employee-wise Expenses
      </p>

      <div className="mt-8 bg-white dark:bg-[#0f172a] rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800">
        <ExpenseDashboard user={user} role={role} />
      </div>
    </div>
  );
}
