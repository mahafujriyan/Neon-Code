"use client";

export default function ExpenseSummary({ expenses }) {
  const now = new Date();

  const empMap = {};
  const genMap = {};
  let totalGenAmount = 0;
  let totalEmpAmount = 0;

  expenses.forEach((e) => {
    if (e.status !== "approved") return;

    const d = new Date(e.expenseDate);
    if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;

    if (e.expenseType === "employee") {
      empMap[e.employeeName] = (empMap[e.employeeName] || 0) + e.amount;
      totalEmpAmount += e.amount;
    } else if (e.expenseType === "general") {
      const category = e.category || "General Expense";
      genMap[category] = (genMap[category] || 0) + e.amount;
      totalGenAmount += e.amount;
    }
  });

  const empData = Object.keys(empMap).map(name => ({ name, amount: empMap[name] })).sort((a, b) => b.amount - a.amount);
  const genData = Object.keys(genMap).map(cat => ({ name: cat, amount: genMap[cat] })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      
      {/* ১. জেনারেল এক্সপেন্স টেবিল */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-black uppercase text-[14px] text-indigo-500 tracking-widest">General Expense Summary</h3>
        </div>
        <div className="flex-grow">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400">
              <tr>
                <th className="p-4 text-left font-black uppercase">Category</th>
                <th className="p-4 text-right font-black uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {genData.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{e.name}</td>
                  <td className="p-4 text-right font-bold text-slate-600 dark:text-slate-400">৳{e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!genData.length && <EmptyState msg="No general expenses" />}
        </div>
        {/* Total Footer for General */}
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/30 border-t border-indigo-100 dark:border-indigo-900/50 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">Total General Expense</span>
          <span className="text-lg font-black text-indigo-700 dark:text-indigo-300">৳{totalGenAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* ২. এমপ্লয়ি এক্সপেন্স টেবিল */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <h3 className="font-black uppercase text-[14px] text-emerald-500 tracking-widest">Employee Expense Summary</h3>
        </div>
        <div className="flex-grow">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400">
              <tr>
                <th className="p-4 text-left font-black uppercase">Employee</th>
                <th className="p-4 text-right font-black uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {empData.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">{e.name}</td>
                  <td className="p-4 text-right font-bold text-slate-600 dark:text-slate-400">৳{e.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!empData.length && <EmptyState msg="No employee expenses" />}
        </div>
        {/* Total Footer for Employee */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-t border-emerald-100 dark:border-emerald-900/50 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Total Employee Expense</span>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">৳{totalEmpAmount.toLocaleString()}</span>
        </div>
      </div>

    </div>
  );
}

function EmptyState({ msg }) {
  return <div className="p-10 text-center text-slate-400 font-bold italic text-[10px] uppercase tracking-widest">{msg}</div>;
}