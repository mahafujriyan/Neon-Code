"use client";
import { useState, useMemo } from "react";
import AddExpenseModal from "./AddExpenseModal";

// ১. এখানে প্রপস হিসেবে onEdit যোগ করা হয়েছে
export default function ExpenseTable({ expenses = [], role, refresh, user, onEdit }) { 
  const [search, setSearch] = useState("");

  // 🔍 SEARCH FILTER
  const filteredExpenses = useMemo(() => {
    if (!search.trim()) return expenses;

    const q = search.toLowerCase();

    return expenses.filter((e) => {
      if (e.expenseType === "employee") {
        return e.employeeName?.toLowerCase().includes(q);
      }
      return e.category?.toLowerCase().includes(q);
    });
  }, [expenses, search]);

  const approve = async (id) => {
    if (!user?.email) return;

    await fetch("/api/expenses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status: "approved",
        approvedBy: user.email,
      }),
    });

    refresh();
  };

  const remove = async (id) => {
    if (!user?.email) {
      alert("User session missing");
      return;
    }

    if (!confirm("Delete this expense?")) return;

    await fetch(`/api/expenses?id=${id}&email=${user.email}`, {
      method: "DELETE",
    });

    refresh();
  };

  return (
    <div className="rounded-2xl border shadow bg-white">

      {/* ===== SEARCH BAR ===== */}
      <div className="p-4 border-b flex flex-col md:flex-row md:items-center gap-3">
        <h3 className="font-black uppercase text-sm text-slate-500">
          Expense Records
        </h3>

        <div className="ml-auto w-full md:w-72 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b">
            <tr className="text-xs uppercase tracking-wider text-slate-500 font-black">
              <th className="px-6 py-4 text-left">Date</th>
              <th className="px-6 py-4 text-left">Type</th>
              <th className="px-6 py-4 text-left">Category / Employee</th>
              <th className="px-6 py-4 text-left">Reason</th>
              <th className="px-6 py-4 text-right">Amount (৳)</th>
              <th className="px-6 py-4 text-center">Status</th>
              {role === "admin" && (
                <th className="px-6 py-4 text-right">Action</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredExpenses.map((e) => (
              <tr key={e._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {new Date(e.expenseDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-600 uppercase">
                    {e.expenseType}
                  </span>
                </td>

                <td className="px-6 py-4 font-semibold">
                  {e.expenseType === "general" ? (
                    <span>{e.category}</span>
                  ) : (
                    <div className="flex flex-col">
                      <span className="font-bold">{e.employeeName}</span>
                      <span className="text-xs text-slate-400">
                        {e.employeeEmail}
                      </span>
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 text-slate-600 max-w-[260px] truncate">
                  {e.reason}
                </td>

                <td className="px-6 py-4 text-right font-black text-red-600">
                  ৳{e.amount.toLocaleString()}
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      e.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                {role === "admin" && (
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* ✅ এখানে setEditData এর বদলে onEdit(e) করা হয়েছে */}
                    <button
                      onClick={() => onEdit(e)} 
                      className="p-2 bg-amber-100 text-amber-600 rounded-lg font-black hover:bg-amber-600 hover:text-white transition"
                    >
                      Edit
                    </button>
                    {e.status === "pending" && (
                      <button
                        onClick={() => approve(e._id)}
                        className="px-3 py-1 text-xs font-black rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={() => remove(e._id)}
                      className="px-3 py-1 text-xs font-black rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* EMPTY STATE */}
        {!filteredExpenses.length && (
          <div className="p-10 text-center text-slate-400 font-black uppercase">
            No matching expenses found
          </div>
        )}
      </div>
    </div>
  );
}