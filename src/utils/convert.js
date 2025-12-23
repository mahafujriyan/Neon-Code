export function convert(amount, currency, rate) {
  if (currency === "USD") return `$${amount}`;
  return `৳${amount * rate}`;
}
