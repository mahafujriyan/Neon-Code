"use client";
import { createContext, useState } from "react";

export const CurrencyContext = createContext();

export default function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(120);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rate, setRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}
