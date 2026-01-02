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
    // ১. প্রথমেই চেক করি ব্রাউজারে আগে থেকে রোল সেভ করা আছে কিনা (স্পিড বাড়ানোর জন্য)
    const cachedRole = sessionStorage.getItem("user-role");
    if (cachedRole === "admin") {
      setIsAdmin(true);
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // যদি ক্যাশে না থাকে বা ইউজারের ইমেইল নতুন হয় তবেই এপিআই কল হবে
        const userEmail = user.email.toLowerCase().trim();
        
        try {
          const res = await fetch(`/api/users?email=${userEmail}`);
          const userData = await res.json();

          if (userData?.role === "admin") {
            sessionStorage.setItem("user-role", "admin"); // রোল সেভ করে রাখা হলো
            setIsAdmin(true);
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
        sessionStorage.removeItem("user-role");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white dark:bg-[#020617]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
          NeonCode Security Checking...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <AdminDashboard user={auth.currentUser} />
    </div>
  );
}