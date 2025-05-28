// components/ApplyDiscount.ts
export function ApplyDiscount(
  totalPrice: number,
  discountRate: number = 0, // Percentage (e.g., 10 for 10%)
  customDiscount: number = 0 // Fixed amount (e.g., 5 for $5 off)
): { discountedPrice: number; discountAmount: number } {
  const discountAmount = Math.min(
    (totalPrice * (discountRate / 100)) + customDiscount,
    totalPrice
  );
  const discountedPrice = Math.max(totalPrice - discountAmount, 0);
  return { discountedPrice: Number(discountedPrice.toFixed(2)), discountAmount: Number(discountAmount.toFixed(2)) };
}