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
    // ১. দ্রুত লোড করার জন্য সেশন থেকে রোল চেক
    const cachedRole = sessionStorage.getItem("user-role");
    const cachedEmail = sessionStorage.getItem("user-email");

    if (cachedRole && (cachedRole === "manager" || cachedRole === "admin")) {
      setUserData({ email: cachedEmail });
      setLoading(false); // ডাটাবেজ চেক করার আগেই লোডিং বন্ধ করে ড্যাশবোর্ড দেখাবে
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userEmail = user.email.toLowerCase().trim();
          
          // ২. ডাটাবেজ থেকে রোল কনফার্ম করা
          const res = await fetch(`/api/users?email=${userEmail}`);
          const data = await res.json();

          if (data?.role === "manager" || data?.role === "admin") {
            // সেশনে ডাটা সেভ করা যাতে পরের বার দ্রুত লোড হয়
            sessionStorage.setItem("user-role", data.role);
            sessionStorage.setItem("user-email", userEmail);
            
            setUserData({ 
                email: user.email, 
                displayName: user.displayName 
            });
            setLoading(false);
          } else {
            sessionStorage.removeItem("user-role");
            router.push("/dashboard"); 
          }
        } catch (error) {
          console.error("Security Check Error:", error);
          router.push("/login");
        }
      } else {
        sessionStorage.clear(); // লগআউট থাকলে সব ক্লিয়ার
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    sessionStorage.clear(); // সেশন ক্লিয়ার করে লগআউট
    await signOut(auth);
    router.push("/login");
  };

  // অ্যাডমিন পেজের মতো ফাস্ট লোডিং অ্যানিমেশন
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          Authenticating Manager...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <ManagerDashboard
        user={userData} 
        role="manager" 
        onLogout={handleLogout} 
      />
    </div>
  );
}