"use client";
import { useState } from "react";

export default function AddOrderModal({ onClose, refresh }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    clientName: "",
    phone: "",
    pageLink: "",
    orderType: "",
    orderDate: "",
    managerName: "Sagor",
    totalAmountUSD: "",
    dollarRate: 120,
    initialPaid: 0,
    workStatus: "pending",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        clientName: form.clientName,
        phone: form.phone,
        pageLink: form.pageLink,
        orderType: form.orderType,
        orderDate: form.orderDate
          ? new Date(form.orderDate)
          : new Date(),
        managerName: form.managerName,
        workStatus: form.workStatus,
        totalAmountUSD: Number(form.totalAmountUSD),
        dollarRate: Number(form.dollarRate),

        payments:
          Number(form.initialPaid) > 0
            ? [
                {
                  paidUSD: Number(form.initialPaid),
                  date: new Date(),
                  addedBy: "admin",
                },
              ]
            : [],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        refresh();
        onClose();
      }
    } catch (err) {
      console.error("Order save error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#020617] text-gray-900 dark:text-gray-100 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Order</h2>
          <button
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder="Client Name"
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
            onChange={(e) =>
              setForm({ ...form, clientName: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Phone Number"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <input
              placeholder="Page / Profile Link"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
              onChange={(e) =>
                setForm({ ...form, pageLink: e.target.value })
              }
            />
          </div>

          <input
            placeholder="Order Type (Facebook Ads, SEO...)"
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
            onChange={(e) =>
              setForm({ ...form, orderType: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
              onChange={(e) =>
                setForm({ ...form, orderDate: e.target.value })
              }
            />

            <select
              className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
              value={form.managerName}
              onChange={(e) =>
                setForm({ ...form, managerName: e.target.value })
              }
            >
              <option value="Sagor">Sagor</option>
              <option value="Sahed">Sahed</option>
              <option value="M. Abdur Rahaman">
                M. Abdur Rahaman
              </option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <input
              type="number"
              placeholder="Total USD"
              className="bg-transparent font-bold outline-none"
              onChange={(e) =>
                setForm({ ...form, totalAmountUSD: e.target.value })
              }
              required
            />
            <input
              type="number"
              value={form.dollarRate}
              className="bg-transparent font-bold outline-none"
              onChange={(e) =>
                setForm({ ...form, dollarRate: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Advance Paid"
              className="bg-transparent font-bold text-green-600 outline-none"
              onChange={(e) =>
                setForm({ ...form, initialPaid: e.target.value })
              }
            />
          </div>

          <select
            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border outline-none"
            onChange={(e) =>
              setForm({ ...form, workStatus: e.target.value })
            }
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Saving..." : "Save Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
