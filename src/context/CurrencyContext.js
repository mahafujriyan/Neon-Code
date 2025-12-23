"use client";
import { createContext, useState } from "react";

export const CurrencyContext = createContext(null);

export default function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [dollarRate, setDollarRate] = useState(120);

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, dollarRate, setDollarRate }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
