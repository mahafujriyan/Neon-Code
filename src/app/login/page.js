"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard/admin");
    } catch (err) {
      setError("INVALID EMAIL OR PASSWORD");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard/admin");
    } catch (err) {
      setError("GOOGLE LOGIN FAILED");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black font-sans">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">NeonCode</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-400 font-medium uppercase text-xs tracking-widest">Login to manage your business</p>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-[2.5rem] bg-white p-10 shadow-2xl dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic">Welcome Back</h2>
          <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NeonCode Access Portal</p>

          {error && <p className="text-red-500 text-xs font-bold mt-4 p-3 bg-red-50 rounded-xl border border-red-100 tracking-tighter">{error}</p>}

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-black py-4 text-white font-black uppercase text-xs shadow-xl hover:scale-[1.02] transition-all dark:bg-white dark:text-black">
              {loading ? "AUTHENTICATING..." : "LOG IN"}
            </button>
          </form>

          <button onClick={handleGoogleLogin} className="mt-4 w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-100 py-4 font-black uppercase text-[10px] hover:bg-gray-50 dark:border-zinc-900 dark:hover:bg-zinc-900 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="Google" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[10px] font-bold text-zinc-400 uppercase">
            New here? <Link href="/register" className="text-indigo-600 dark:text-indigo-400">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}