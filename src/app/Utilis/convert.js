export const convert = (amount, currency, rate) => {
  if (currency === "USD") return `$${amount.toLocaleString()}`;
  return `৳${(amount * rate).toLocaleString()}`;
};
