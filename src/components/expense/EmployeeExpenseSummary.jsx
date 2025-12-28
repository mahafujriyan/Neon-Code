"use client";

export default function EmployeeExpenseSummary({ expenses }) {
  const now = new Date();

  const empMap = {};

  expenses.forEach((e) => {
    if (e.status !== "approved") return;
    if (e.expenseType !== "employee") return;

    const d = new Date(e.expenseDate);
    if (
      d.getMonth() !== now.getMonth() ||
      d.getFullYear() !== now.getFullYear()
    ) {
      return;
    }

    empMap[e.employeeName] =
      (empMap[e.employeeName] || 0) + e.amount;
  });

  const data = Object.keys(empMap)
    .map((name) => ({
      name,
      amount: empMap[name],
    }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="bg-white rounded-2xl shadow border overflow-hidden">
      <div className="p-5 border-b">
        <h3 className="font-black uppercase text-sm text-gray-500">
          Employee Expense Summary (Monthly)
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-right">Total Expense (৳)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((e, i) => (
            <tr key={i} className="border-t">
              <td className="p-3 font-bold">{e.name}</td>
              <td className="p-3 text-right font-black text-red-600">
                ৳{e.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!data.length && (
        <div className="p-6 text-center text-gray-400 font-bold">
          No employee expenses this month
        </div>
      )}
    </div>
  );
}
