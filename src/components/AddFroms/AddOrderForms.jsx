"use client";
import { useState } from "react";

export default function AddOrderForm({ onSuccess }) {
  const [form, setForm] = useState({
    orderId: "",
    clientName: "",
    companyName: "",
    orderType: "",
    managerName: "",
    totalAmountUSD: "",
    paidAmountUSD: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        totalAmountUSD: Number(form.totalAmountUSD),
        paidAmountUSD: Number(form.paidAmountUSD),
      }),
    });

    onSuccess();
    setForm({
      orderId: "",
      clientName: "",
      companyName: "",
      orderType: "",
      managerName: "",
      totalAmountUSD: "",
      paidAmountUSD: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
      <input name="orderId" placeholder="Order ID" onChange={handleChange} value={form.orderId} className="border p-2" required />
      <input name="clientName" placeholder="Client Name" onChange={handleChange} value={form.clientName} className="border p-2" required />
      <input name="companyName" placeholder="Company Name" onChange={handleChange} value={form.companyName} className="border p-2" required />
      <input name="orderType" placeholder="Order Type" onChange={handleChange} value={form.orderType} className="border p-2" required />
      <input name="managerName" placeholder="Manager Name" onChange={handleChange} value={form.managerName} className="border p-2" required />
      <input type="number" name="totalAmountUSD" placeholder="Total Amount (USD)" onChange={handleChange} value={form.totalAmountUSD} className="border p-2" required />
      <input type="number" name="paidAmountUSD" placeholder="Paid Amount (USD)" onChange={handleChange} value={form.paidAmountUSD} className="border p-2" required />

      <button className="col-span-2 bg-black text-white py-2 rounded">
        Add Order
      </button>
    </form>
  );
}
