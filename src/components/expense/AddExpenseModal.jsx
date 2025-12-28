"use client";
import { useState } from "react";

const EMPLOYEES = [
  "Sagor",
  "Shahed",
  "Mahafuj",
  "M Abdur Rahaman",
  "Iqbal",
  "Abdullah Developer",
  "Abdullah Designer",
  "Redown",
];

// ✅ editData প্রপসটি যোগ করা হয়েছে
export default function AddExpenseModal({ onClose, refresh, user, editData }) {
  // 🔐 SAFETY
  if (!user?.email) return null;

  // ✅ যদি editData থাকে তবে সেগুলো ডিফল্ট ভ্যালু হিসেবে বসবে
  const [tab, setTab] = useState(editData?.expenseType || "general");
  const [form, setForm] = useState({
    category: editData?.category || "Office Supplies",
    employeeName: editData?.employeeName || "",
    reason: editData?.reason || "",
    amount: editData?.amount || "",
  });

  const submit = async () => {
    if (!form.reason || !form.amount) {
      alert("Reason & amount required");
      return;
    }

    if (tab === "employee" && !form.employeeName) {
      alert("Please select employee");
      return;
    }

    // ✅ এডিট মোড না কি অ্যাড মোড সেটা চেক করা হচ্ছে
    const isEdit = !!editData?._id;

    await fetch("/api/expenses", {
      method: isEdit ? "PUT" : "POST", // এডিট হলে PUT হবে
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: isEdit ? editData._id : undefined, // এডিট হলে আইডি পাঠাবে
        isUpdate: isEdit ? true : undefined,   // API কে সিগন্যাল দিবে এটা আপডেট
        expenseType: tab,

        // GENERAL
        category: tab === "general" ? form.category : undefined,

        // EMPLOYEE
        employeeName: tab === "employee" ? form.employeeName : undefined,
        employeeEmail: tab === "employee" ? (editData?.employeeEmail || user.email) : undefined,

        // COMMON
        reason: form.reason,
        amount: Number(form.amount),

        // 🔥 IMPORTANT (Manager visibility)
        managerName: editData?.managerName || user.name || "Unknown",
        managerEmail: editData?.managerEmail || user.email,
        createdByEmail: editData?.createdByEmail || user.email,

        status: editData?.status || "pending",
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
          {/* ✅ টাইটেল পরিবর্তন হবে এডিট মোড অনুযায়ী */}
          <h2 className="font-black text-lg uppercase">
            {editData ? "Edit Expense" : "Add Expense"}
          </h2>
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

        {/* GENERAL */}
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

        {/* EMPLOYEE */}
        {tab === "employee" && (
          <>
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

            <input
              value={editData?.employeeEmail || user.email}
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
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Amount (৳)"
          className="w-full p-3 border rounded-xl"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black hover:bg-indigo-700"
        >
          {/* ✅ বাটন টেক্সট এডিট মোড অনুযায়ী পরিবর্তন হবে */}
          {editData ? "Update Expense" : "Save Expense"}
        </button>
      </div>
    </div>
  );
}