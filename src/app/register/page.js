"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // For demo: credentials login (replace with API call in real app)
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      // Successful login → redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black">
      {/* Left Animation */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-300">
          Register to access the Neon Code management system.
        </p>
        <div className="mt-10 h-40 w-40 animate-pulse rounded-full bg-zinc-700/40" />
      </div>

      {/* Register Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-950">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in your details to register or use Google login.
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 outline-none dark:bg-zinc-900"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="mt-4 w-full rounded-lg border py-2 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-black dark:text-white">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
