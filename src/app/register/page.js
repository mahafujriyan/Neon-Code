"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase"; 
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";

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
      // ১. Firebase Register
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      // ২. Save to MongoDB (এটি ব্যাকএন্ডে ডিফল্ট ম্যানেজার হিসেবে সেভ হবে)
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }), 
      });
      
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? "Email already exists" : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Google user info save to MongoDB
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: result.user.email, 
          name: result.user.displayName
        }),
      });

      router.push("/dashboard/admin");
    } catch (err) {
      setError("Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

 

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black font-sans">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-bold italic tracking-tighter uppercase">NeonCode</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-400 font-medium uppercase text-xs tracking-widest">
          Register to access the management system.
        </p>
        <div className="mt-10 h-40 w-40 animate-pulse rounded-full bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]" />
      </div>

      <div className="flex items-center justify-center px-4 py-8 md:px-6">
        <div className="w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] bg-white p-6 md:p-10 shadow-2xl dark:bg-zinc-950 border border-gray-100 dark:border-zinc-900">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 uppercase italic">Create Account</h2>
          <p className="mt-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Join NeonCode Management</p>

          {error && <p className="text-red-500 text-[10px] font-bold mt-4 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 uppercase tracking-tighter">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input type="text" placeholder="FULL NAME" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20 transition-all" required />
            <input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20 transition-all" required />
            
            <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-gray-100 px-5 py-4 text-xs font-bold outline-none dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 ring-indigo-500/20 transition-all" required />

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-indigo-600 py-4 text-white font-black uppercase text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-8 text-center">
            <span className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100 dark:border-zinc-900"></span></span>
            <span className="relative bg-white dark:bg-zinc-950 px-4 text-[10px] font-bold text-gray-400 uppercase">OR</span>
          </div>

          <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-100 py-4 font-black uppercase text-[10px] hover:bg-gray-50 dark:border-zinc-900 dark:hover:bg-zinc-900 transition-all">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4" alt="Google" />
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[10px] font-bold text-zinc-400 uppercase">
            Already have an account? <Link href="/login" className="text-indigo-600 dark:text-indigo-400">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}