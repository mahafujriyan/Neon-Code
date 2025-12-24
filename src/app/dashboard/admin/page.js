"use client";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // MongoDB API থেকে ইউজারের রোল চেক করা
          const res = await fetch(`/api/users?email=${user.email}`);
          const userData = await res.json();

          if (userData?.role === "admin") {
            setIsAdmin(true);
            setLoading(false);
          } else {
            // যদি ইউজার এডমিন না হয়, তাকে ড্যাশবোর্ড বা অন্য কোথাও পাঠিয়ে দেওয়া
            // এখানে আপনি চাইলে ManagerDashboard ও দেখাতে পারেন অথবা রিডাইরেক্ট করতে পারেন
            router.push("/dashboard"); 
          }
        } catch (error) {
          console.error("Security Check Error:", error);
          router.push("/login");
        }
      } else {
        // লগইন না থাকলে লগইন পেজে রিডাইরেক্ট
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // সিকিউরিটি চেকিং লোডার
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          NeonCode Admin Verifying...
        </p>
      </div>
    );
  }

  
  return (
    <div className="animate-in fade-in duration-700">
      <AdminDashboard user={auth.currentUser} />
    </div>
  );
}