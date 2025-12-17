
"use client";
import { signOut } from "next-auth/react";

export default function DashboardContent({ role }) {
  return (
    <div>
      <h1>{role} Dashboard</h1>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
    </div>
  );
}
