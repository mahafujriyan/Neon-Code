"use client";

const COLORS = [
  "#6366f1", "#22c55e", "#f97316", "#ef4444",
  "#14b8a6", "#eab308", "#8b5cf6", "#ec4899",
];

export default function EmployeeExpensePie({ expenses = [] }) { // Default value []
  const now = new Date();
  
  // ১. ফিল্টারিং চেক করুন (নিশ্চিত হোন ডাটাবেসে expenseType 'employee' কি না)
  const approved = expenses.filter(
    (e) =>
      e.status === "approved" &&
      e.expenseType === "employee" &&
      new Date(e.expenseDate).getMonth() === now.getMonth() &&
      new Date(e.expenseDate).getFullYear() === now.getFullYear()
  );

  const map = {};
  approved.forEach((e) => {
    map[e.employeeName] = (map[e.employeeName] || 0) + Number(e.amount); // Number নিশ্চিত করা
  });

  const entries = Object.entries(map);
  
  // ডাটা না থাকলে ইউজারকে মেসেজ দিন, নাল পাঠালে স্ক্রিন খালি দেখাবে
  if (!entries.length) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow border text-center font-bold text-gray-400 uppercase">
        No Approved Employee Expenses This Month
      </div>
    );
  }

  const total = entries.reduce((s, [, v]) => s + v, 0);

  let cumulative = 0;

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const arc = (cx, cy, r, start, end) => {
    const s = polarToCartesian(cx, cy, r, end);
    const e = polarToCartesian(cx, cy, r, start);
    // ৩৬০ ডিগ্রির ক্ষেত্রে লজিক ফিক্স
    const large = end - start <= 180 ? 0 : 1;

    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y} Z`;
  };

  const slices = entries.map(([name, value], i) => {
    const start = (cumulative / total) * 360;
    const angle = (value / total) * 360;
    cumulative += value;

    return {
      name,
      value,
      start,
      end: start + angle,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow border flex flex-col lg:flex-row gap-8 items-center">
      <div>
        <h3 className="font-black uppercase text-sm text-gray-500 mb-4">
          Monthly Employee Expense (Pie)
        </h3>

        {/* ২. SVG তে overflow-visible দিন এবং সাইজ নিশ্চিত করুন */}
        <svg width="260" height="260" viewBox="0 0 260 260" className="overflow-visible">
          {slices.map((s, i) => (
            <path
              key={i}
              d={arc(130, 130, 120, s.start, s.end)}
              fill={s.color}
              stroke="white"           // স্লাইসগুলোর মাঝখানে বর্ডার
              strokeWidth="2"          // যাতে আলাদা বোঝা যায়
              className="hover:opacity-80 transition-opacity cursor-pointer"
            />
          ))}
        </svg>
      </div>

      <div className="space-y-3">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-sm font-bold">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="dark:text-gray-800">{s.name}</span>
            <span className="text-indigo-600 font-black">৳{s.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}