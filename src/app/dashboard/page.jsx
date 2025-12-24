"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import ManagerDashboard from "@/components/dashboard/ManagerDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        try {
          // ১. MongoDB থেকে ইউজারের রোল নিয়ে আসা
          const res = await fetch(`/api/users?email=${user.email}`);
          const userData = await res.json();
          setUserRole(userData?.role || "manager");
        } catch (err) {
          console.error("Role fetch error:", err);
          setUserRole("manager"); 
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020617]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">
            NeonCode Security Checking...
          </p>
        </div>
      </div>
    );
  }

  // আপডেট এখানে: আমরা 'userRole' টি কম্পোনেন্টে প্রপ হিসেবে পাঠিয়ে দিচ্ছি
  return (
    <>
      {userRole === "admin" ? (
        <AdminDashboard 
          user={auth.currentUser} 
          role={userRole} 
          onLogout={handleLogout} 
        />
      ) : (
        <ManagerDashboard 
          user={auth.currentUser} 
          role={userRole} 
          onLogout={handleLogout} 
        />
      )}
    </>
  );
}