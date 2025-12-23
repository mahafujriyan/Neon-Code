"use client";
import { useState } from "react";

export default function AddPaymentModal({ order, onClose, refresh }) {
  const [paidUSD, setPaidUSD] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitPayment = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("orderId", order._id);
    formData.append("paidUSD", paidUSD);
    formData.append("dollarRate", order.dollarRate);
    formData.append("paymentMethod", "cash");
    if (image) formData.append("image", image);

    await fetch("/api/payments", {
      method: "POST",
      body: formData,
    });

    refresh();
    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl w-96">
        <h3 className="font-bold mb-4">
          Add Payment – {order.clientName}
        </h3>

        <input
          type="number"
          placeholder="Paid USD"
          className="w-full p-3 border rounded mb-3"
          onChange={(e) => setPaidUSD(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <div className="flex gap-2">
          <button
            onClick={submitPayment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
