"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [role, setRole] = useState("user");

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-zinc-50 dark:bg-black">
      
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-black to-zinc-800 text-white p-10">
        <h1 className="text-4xl font-bold">Welcome</h1>
        <p className="mt-4 max-w-sm text-center text-zinc-300">
          Register to access the Neon Code  management system.
        </p>

        <div className="mt-10 h-40 w-40 animate-pulse rounded-full bg-zinc-700/40" />
      </div>

      {/*  Form */}
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-950">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Create Account
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Fill in your details to register
          </p>

          <form className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring dark:bg-zinc-900"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring dark:bg-zinc-900"
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
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring dark:bg-zinc-900"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-black py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black"
            >
              Register
            </button>
          </form>

          {/* Google*/}
          <button
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
