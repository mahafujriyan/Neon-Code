"use client";
import { useState } from "react";

export default function OrdersTable({ orders, onAddPayment }) {
  const [preview, setPreview] = useState(null);

  return (
    <>
      <table className="w-full text-sm bg-white dark:bg-slate-900 rounded-2xl">
        <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase">
          <tr>
            <th className="p-3">Client</th>
            <th className="p-3">Total</th>
            <th className="p-3">Paid</th>
            <th className="p-3">Proof</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const paid =
              o.payments?.reduce((s, p) => s + (p.paidUSD || 0), 0) || 0;

            return (
              <tr key={o._id} className="border-t">
                <td className="p-3">{o.clientName}</td>
                <td className="p-3">${o.totalAmountUSD}</td>
                <td className="p-3 text-green-600">${paid}</td>
                <td className="p-3 flex gap-2">
                  {o.payments?.map(
                    (p, i) =>
                      p.screenshot && (
                        <img
                          key={i}
                          src={p.screenshot}
                          className="w-8 h-8 rounded cursor-pointer object-cover"
                          onClick={() => setPreview(p.screenshot)}
                        />
                      )
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onAddPayment(o)}
                    className="text-blue-600 text-xs font-bold"
                  >
                    Add Payment
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {preview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setPreview(null)}
        >
          <img src={preview} className="max-h-[90%] max-w-[90%]" />
        </div>
      )}
    </>
  );
}
