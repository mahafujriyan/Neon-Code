import { convert } from "@/app/Utilis/convert";

export default function OrdersTable({ orders, currency, rate }) {
  return (
    <table className="w-full text-sm">
      <thead className="border-b">
        <tr className="text-left">
          <th>Order ID</th>
          <th>Client</th>
          <th>Order Type</th>
          <th>Manager</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Due</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map(o => (
          <tr key={o.id} className="border-b">
            <td>{o.id}</td>
            <td>
              <p className="font-medium">{o.client}</p>
              <p className="text-xs text-gray-400">{o.company}</p>
            </td>
            <td>{o.type}</td>
            <td>{o.manager}</td>
            <td>{convert(o.total, currency, rate)}</td>
            <td className="text-green-600">
              {convert(o.paid, currency, rate)}
            </td>
            <td className="text-red-600">
              {convert(o.due, currency, rate)}
            </td>
            <td>
              <span className={`px-2 py-1 rounded text-xs ${
                o.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {o.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
