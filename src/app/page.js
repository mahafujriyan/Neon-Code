"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase"; // Firebase Auth ইম্পোর্ট করুন
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState(null);

  // ইউজার লগইন আছে কি না তা চেক করার জন্য
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ফিচারের ডাটাবেস (লিঙ্কসহ)
  const features = [
    { title: "Admin Dashboard", path: "/dashboard/admin" },
    { title: "Manager Control", path: "/dashboard/manager" },
    { title: "Payment Tracking", path: "/dashboard/admin" },
    { title: "Role-Based Access", path: "/register" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center px-6">
      <main className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <h1 className="text-xl font-black uppercase italic tracking-tighter text-indigo-600 dark:text-indigo-400">
            NeonCode 
          </h1>

          <Link
            href={user ? "/dashboard/admin" : "/login"}
            className="rounded-full bg-black px-5 py-2 text-sm font-bold uppercase text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 transition-all"
          >
            {user ? "Dashboard" : "Login"}
          </Link>
        </header>

        {/* Hero Section */}
        <section className="mt-20 grid gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-4xl font-black leading-tight text-zinc-900 dark:text-zinc-50 uppercase italic">
              Simple Internal
              <br />
              Company Management
            </h2>

            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 font-medium">
              Manage clients, orders, payments, and dues in one place.
              Designed for small teams with role-based dashboards.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/login"
                className="rounded-2xl bg-indigo-600 px-8 py-4 text-white font-black uppercase text-xs shadow-xl hover:scale-105 transition-all"
              >
                Get Started
              </Link>

              <Link
                href="/register"
                className="rounded-2xl border border-zinc-300 px-8 py-4 font-black uppercase text-xs text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900 transition-all"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center relative">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-full blur-3xl"></div>
            <Image
              src="/dashboard.png"
              alt="Dashboard Preview"
              width={420}
              height={300}
              className="rounded-2xl shadow-2xl dark:shadow-indigo-500/10 relative z-10 border border-white/10"
              priority
            />
          </div>
        </section>

        {/* Features Section - এখানে লিঙ্ক আপডেট করা হয়েছে */}
        <section className="mt-24 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {features.map((feature) => (
            <Link
              href={feature.path}
              key={feature.title}
              className="rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-950 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all group shadow-sm hover:shadow-md"
            >
              <h3 className="font-black text-zinc-900 dark:text-zinc-100 uppercase text-xs italic group-hover:text-indigo-500">
                {feature.title}
              </h3>
              <p className="mt-2 text-[10px] font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-widest">
                Access System
              </p>
            </Link>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-24 py-6 text-center text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} NeonCode Internal System
        </footer>
      </main>
    </div>
  );
}