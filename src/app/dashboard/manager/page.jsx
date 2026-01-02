"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";


export default function ManagerPage() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // আপনার AdminPage এর মতই এখানে রোল চেক করা হচ্ছে
          const res = await fetch(`/api/users?email=${user.email.toLowerCase()}`);
          const data = await res.json();

          if (data?.role === "manager" || data?.role === "admin") {
            setUserData({ 
                email: user.email, 
                displayName: user.displayName 
            });
            setLoading(false);
          } else {
            // রোল না থাকলে মেইন ড্যাশবোর্ডে রিডাইরেক্ট
            router.push("/dashboard"); 
          }
        } catch (error) {
          console.error("Security Check Error:", error);
          router.push("/login");
        }
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  // অ্যাডমিন পেজের মতো লোডিং অ্যানিমেশন
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-[0.1em] animate-pulse">
          NeonCode Manager Verifying...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <ManagerDashboard
        user={userData} 
        role="manager" 
        onLogout={handleLogout} 
      />
    </div>
  );
}