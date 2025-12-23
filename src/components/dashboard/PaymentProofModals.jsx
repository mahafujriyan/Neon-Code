"use client";
import { useState } from "react";

export default function PaymentProofModal({ order, onClose, refresh }) {
  const [file, setFile] = useState(null);
  const [paidUSD, setPaidUSD] = useState("");
  const [preview, setPreview] = useState(null);

  const submit = async () => {
    const fd = new FormData();
    fd.append("orderId", order._id);
    fd.append("paidUSD", paidUSD);
    if (file) fd.append("screenshot", file);

    await fetch("/api/orders/payment", {
      method: "POST",
      body: fd,
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-bold mb-3">{order.clientName}</h2>

        {preview && (
          <img src={preview} className="h-40 w-full object-contain mb-3" />
        )}

        <input
          type="number"
          placeholder="Paid USD"
          className="w-full p-2 border mb-3"
          onChange={(e) => setPaidUSD(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setFile(e.target.files[0]);
            setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded flex-1"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded flex-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
