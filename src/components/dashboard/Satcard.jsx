export default function StatsCard({ title, value, subtitle, color }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
