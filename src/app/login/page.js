"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async e => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res?.error) setError("Invalid credentials");
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black">
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-300">Login to continue</p>
      </div>

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-950">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Login</h2>
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900" required />
            <button type="submit" className="w-full rounded-lg bg-black py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black">Login</button>
          </form>

          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="mt-4 w-full rounded-lg border py-2 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900">Continue with Google</button>

          <p className="mt-4 text-center text-sm text-zinc-500">Don’t have an account? <Link href="/register" className="font-medium text-black dark:text-white">Register</Link></p>
        </div>
      </div>
    </div>
  );
}
