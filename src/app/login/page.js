"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
      router.push("/dashboard/admin");
    } catch (err) {
      setError("ইমেইল অথবা পাসওয়ার্ড ভুল!");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("আগে আপনার ইমেইলটি লিখুন!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("পাসওয়ার্ড রিসেট লিংক ইমেইলে পাঠানো হয়েছে!");
      setError("");
    } catch (err) {
      setError("ইমেইলটি সঠিক নয় অথবা ইউজার খুঁজে পাওয়া যায়নি।");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black font-sans">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-black italic tracking-tighter uppercase">NeonCode</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-400 font-medium uppercase text-xs tracking-widest">Login to manage your business</p>
      </div>

      <div className="flex items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] bg-white p-6 md:p-10 shadow-2xl dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic">Welcome Back</h2>
          <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NeonCode Access Portal</p>

          {error && <p className="text-red-500 text-[10px] font-bold mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 uppercase">{error}</p>}
          {message && <p className="text-green-500 text-[10px] font-bold mt-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/20 uppercase">{message}</p>}

          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20" required />
            
            <div className="text-right">
              <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase hover:underline">Forgot Password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-black py-4 text-white font-black uppercase text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all dark:bg-white dark:text-black disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : "LOG IN"}
            </button>
          </form>

          <p className="mt-8 text-center text-[10px] font-bold text-zinc-400 uppercase">
            New here? <Link href="/register" className="text-indigo-600 dark:text-indigo-400">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}