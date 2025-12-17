"use client";

import { useEffect, useState, useContext } from "react";
import AddOrderForm from "@/components/AddFroms/AddOrderForms";
import StatsCard from "@/components/dashboard/Satcard";
import OrdersTable from "@/components/dashboard/OrderTable";
import { CurrencyContext } from "@/app/context/CurrenceyContext";
import { convert } from "@/app/Utilis/convert";

export default function AdminDashboard() {
  const { currency, rate } = useContext(CurrencyContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + o.totalAmountUSD, 0);
  const totalPaid = orders.reduce((s, o) => s + o.paidAmountUSD, 0);
  const totalDue = orders.reduce((s, o) => s + o.dueAmountUSD, 0);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <AddOrderForm onSuccess={loadOrders} />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Revenue" value={convert(totalRevenue, currency, rate)} />
        <StatsCard title="Total Paid" value={convert(totalPaid, currency, rate)} />
        <StatsCard title="Total Due" value={convert(totalDue, currency, rate)} />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <OrdersTable
          orders={orders.map(o => ({
            id: o.orderId,
            client: o.clientName,
            company: o.companyName,
            type: o.orderType,
            manager: o.managerName,
            total: o.totalAmountUSD,
            paid: o.paidAmountUSD,
            due: o.dueAmountUSD,
            status: o.status,
          }))}
          currency={currency}
          rate={rate}
        />
      </div>
    </div>
  );
}
