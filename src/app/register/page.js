"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), password);
      await updateProfile(userCredential.user, { displayName: name });

      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase(), name }), 
      });
      
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? "Email already exists" : "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black font-sans">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-bold italic tracking-tighter uppercase">NeonCode</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-400 font-medium uppercase text-xs tracking-widest">Register to access the management system.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] bg-white p-6 md:p-10 shadow-2xl dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic">Create Account</h2>
          <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Join NeonCode Management</p>

          {error && <p className="text-red-500 text-[10px] font-bold mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 uppercase">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input type="text" placeholder="FULL NAME" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 py-4 text-white font-black uppercase text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-zinc-400 uppercase">
            Already have an account? <Link href="/login" className="text-indigo-600 dark:text-indigo-400">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}