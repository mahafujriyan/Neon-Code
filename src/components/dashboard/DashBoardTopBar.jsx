"use client";


import { CurrencyContext } from "@/context/CurrencyContext";
import { useContext } from "react";


export default function DashboardTopBar() {
  const { currency, setCurrency, dollarRate, setDollarRate } =
    useContext(CurrencyContext);

  return (
    <div className="flex items-center justify-end gap-4 mt-6">
      {/* Currency */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Currency</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="USD">USD ($)</option>
          <option value="BDT">BDT (৳)</option>
        </select>
      </div>

      {/* Dollar Rate */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Dollar Rate</span>
        <input
          type="number"
          value={dollarRate}
          onChange={(e) => setDollarRate(Number(e.target.value))}
          className="border rounded px-3 py-1 w-24 text-sm"
        />
      </div>
    </div>
  );
}
