"use client";
import { useEffect, useState } from "react";

import EmployeeExpenseSummary from "./EmployeeExpenseSummary";
import ExpenseTable from "./ExpenseTable";
import AddExpenseModal from "./AddExpenseModal";


export default function ExpenseDashboard({ user, role }) {
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    if (!user?.email) return;
    const res = await fetch(`/api/expenses?email=${user.email}`);
    const data = await res.json();
    setExpenses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // ===== TOP STATS =====
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  const approved = expenses.filter(e => e.status === "approved");

  const total = approved.reduce((s, e) => s + e.amount, 0);
  const todayTotal = approved
    .filter(e => new Date(e.expenseDate).toISOString().split("T")[0] === today)
    .reduce((s, e) => s + e.amount, 0);

  const monthTotal = approved
    .filter(e => {
      const d = new Date(e.expenseDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-10">

      {/* ===== TOP BAR ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat title="Today Expense" value={`৳${todayTotal}`} />
        <Stat title="Monthly Expense" value={`৳${monthTotal}`} />
        <Stat title="Total Expense" value={`৳${total}`} />
      </div>

      {/* ===== ACTION BAR ===== */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black uppercase">Expense Dashboard</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black"
        >
          + Add Expense
        </button>
      </div>

   
<EmployeeExpenseSummary expenses={expenses} />
      {/* ===== TABLE ===== */}
      <ExpenseTable
        expenses={expenses}
        role={role}
        user={user}
        refresh={loadData}
      />

      {showModal && (
        <AddExpenseModal
          user={user}
          refresh={loadData}
          onClose={() => setShowModal(false)}
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
