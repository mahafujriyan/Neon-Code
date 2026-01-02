"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import EmployeeExpenseSummary from "./EmployeeExpenseSummary";
import ExpenseTable from "./ExpenseTable";
import AddExpenseModal from "./AddExpenseModal";

export default function ExpenseDashboard({ user, role }) {
  const router = useRouter();

  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // ✅ এডিট ডাটা রাখার জন্য নতুন স্টেট
  const [editData, setEditData] = useState(null);

  const loadData = async () => {
    if (!user?.email) return;
    const res = await fetch(`/api/expenses?email=${user.email}`);
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (user?.email) loadData();
  }, [user]);

  /* ================= STATS ================= */
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  const approved = expenses.filter(e => e.status === "approved");

  const total = approved.reduce((s, e) => s + e.amount, 0);
  const todayTotal = approved
    .filter(e => new Date(e.createdAt).toISOString().split("T")[0] === today)
    .reduce((s, e) => s + e.amount, 0);

  const monthTotal = approved
    .filter(e => {
      const d = new Date(e.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-10">

      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Today Expense" value={`৳${todayTotal}`} />
        <Stat title="Monthly Expense" value={`৳${monthTotal}`} />
        <Stat title="Total Expense" value={`৳${total}`} />
      </div>

      {/* ===== ACTION BAR ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase">
          {role === "admin" ? "Admin Expense Dashboard" : "My Expenses"}
        </h2>

        {/* ✅ বাটনটি ঠিকমতো কাজ করবে এখন */}
        <button
          onClick={() => {
            setEditData(null); // নতুন অ্যাড করার জন্য আগের ডাটা ক্লিয়ার করা
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black hover:bg-indigo-700 active:scale-95 transition-all shadow-lg"
        >
          + Add Expense
        </button>
      </div>

      {/* ===== ADMIN ONLY SUMMARY ===== */}
    
        <EmployeeExpenseSummary expenses={expenses} />
    

      {/* ===== TABLE ===== */}
   <ExpenseTable
  expenses={expenses}
  role={role}
  user={user}
  refresh={loadData}
  onEdit={(data) => {
    setEditData(data);
    setShowModal(true);
  }}
/>

      {/* ===== MODAL (Add & Edit Both) ===== */}
      {showModal && user && (
        <AddExpenseModal
          user={user}
          refresh={loadData}
          editData={editData} 
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
        />
      )}
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow border">
      <p className="text-xs uppercase text-gray-400 font-black">{title}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}