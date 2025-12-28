"use client";

export default function ExpenseTable({ expenses = [], role, refresh, user }) {

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
    <div className="overflow-x-auto rounded-2xl border shadow bg-white">
      <table className="min-w-full text-sm">
        
        {/* ===== HEADER ===== */}
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

        {/* ===== BODY ===== */}
        <tbody className="divide-y">
          {expenses.map((e) => (
            <tr
              key={e._id}
              className="hover:bg-slate-50 transition"
            >
              {/* DATE */}
              <td className="px-6 py-4 font-semibold text-slate-700">
                {new Date(e.expenseDate).toLocaleDateString()}
              </td>

              {/* TYPE */}
              <td className="px-6 py-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-600 uppercase">
                  {e.expenseType}
                </span>
              </td>

              {/* CATEGORY / EMPLOYEE */}
              <td className="px-6 py-4 font-semibold">
                {e.expenseType === "general" ? (
                  <span className="text-slate-800">{e.category}</span>
                ) : (
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800">
                      {e.employeeName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {e.employeeEmail}
                    </span>
                  </div>
                )}
              </td>

              {/* REASON */}
              <td className="px-6 py-4 text-slate-600 max-w-[260px] truncate">
                {e.reason}
              </td>

              {/* AMOUNT */}
              <td className="px-6 py-4 text-right font-black text-red-600">
                ৳{e.amount.toLocaleString()}
              </td>

              {/* STATUS */}
              <td className="px-6 py-4 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase
                    ${
                      e.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {e.status}
                </span>
              </td>

              {/* ACTIONS */}
              {role === "admin" && (
                <td className="px-6 py-4 text-right space-x-2">
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
      {!expenses.length && (
        <div className="p-10 text-center text-slate-400 font-black uppercase">
          No expenses found
        </div>
      )}
    </div>
  );
}
