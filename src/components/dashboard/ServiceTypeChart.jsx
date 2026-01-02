"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ServiceTypeChart({ orders }) {
  // ১. ডাটা প্রসেসিং: সার্ভিস টাইপ অনুযায়ী Revenue ক্যালকুলেট করা
  const chartData = orders.reduce((acc, order) => {
    const type = order.orderType || "Other";
    const found = acc.find((item) => item.name === type);

    // Revenue calculation
    const amount = Number(order.totalAmountUSD) > 0 ? Number(order.totalAmountUSD) : (Number(order.taskCount) || 0);
    const revenue = amount * (Number(order.dollarRate) || 1);

    if (found) {
      found.total += revenue;
    } else {
      acc.push({ name: type, total: revenue });
    }
    return acc;
  }, []);

  // সুন্দর কিছু কালার সেট
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="bg-white dark:bg-[#0f172a] p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl">
      <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-8">
        Service Revenue Analytics (৳)
      </h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "bold" }} 
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                borderRadius: '16px', 
                border: 'none', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backgroundColor: '#1e293b',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar dataKey="total" radius={[10, 10, 10, 10]} barSize={40}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}