"use client";
import { useState } from "react";

const EMPLOYEES = [
  "Shahed",
  "Mahafuj",
  "M Abdur Rahaman",
  "Iqbal",
  "Abdullah Developer",
  "Abdullah Designer",
  "Redown",
];

export default function AddExpenseModal({ onClose, refresh, user }) {
  // 🔐 SAFETY GUARD
  if (!user || !user.email) return null;

  const [tab, setTab] = useState("general");
  const [form, setForm] = useState({
    expenseType: "general",
    category: "Office Supplies",
    employeeName: "",
    reason: "",
    amount: "",
  });

  const submit = async () => {
    if (!form.reason || !form.amount) {
      alert("Reason & amount required");
      return;
    }

    if (tab === "employee" && !form.employeeName) {
      alert("Please select employee name");
      return;
    }

    await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expenseType: tab,
        category: tab === "general" ? form.category : undefined,

        // ✅ EMPLOYEE LOGIC
        employeeName: tab === "employee" ? form.employeeName : undefined,
        employeeEmail: tab === "employee" ? user.email : undefined,

        reason: form.reason,
        amount: Number(form.amount),

        managerName: user.name || "Unknown",
        managerEmail: user.email,
        createdByEmail: user.email,

        status: "pending", // 🔥 ADMIN WILL APPROVE
      }),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] rounded-2xl p-6 space-y-4">
        
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-black text-lg uppercase">Add Expense</h2>
          <button onClick={onClose} className="text-xl font-black">
            &times;
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b pb-2">
          <button
            onClick={() => setTab("general")}
            className={`font-black ${
              tab === "general" ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setTab("employee")}
            className={`font-black ${
              tab === "employee" ? "text-indigo-600" : "text-gray-400"
            }`}
          >
            Employee
          </button>
        </div>

        {/* GENERAL EXPENSE */}
        {tab === "general" && (
          <select
            className="w-full p-3 border rounded-xl"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option>Office Supplies</option>
            <option>Transport</option>
            <option>Internet Bill</option>
            <option>Wifi Bill</option>
            <option>Snacks</option>
            <option>Utility Bill</option>
            <option>Other</option>
          </select>
        )}

        {/* EMPLOYEE EXPENSE */}
        {tab === "employee" && (
          <>
            {/* EMPLOYEE NAME */}
            <select
              className="w-full p-3 border rounded-xl"
              value={form.employeeName}
              onChange={(e) =>
                setForm({ ...form, employeeName: e.target.value })
              }
            >
              <option value="">Select Employee</option>
              {EMPLOYEES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* EMPLOYEE EMAIL (READ ONLY) */}
            <input
              value={user.email}
              readOnly
              className="w-full p-3 border rounded-xl bg-gray-100 text-gray-500 font-bold cursor-not-allowed"
            />
          </>
        )}

        {/* COMMON */}
        <input
          placeholder="Reason"
          className="w-full p-3 border rounded-xl"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount (৳)"
          className="w-full p-3 border rounded-xl"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700"
        >
          Save Expense
        </button>
      </div>
    </div>
  );
}
