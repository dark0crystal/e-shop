// components/CalculateTotalPrice.ts
export function CalculateTotalPrice(orderItems: { price: number; quantity: number }[]): number {
  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Number(subtotal.toFixed(2)); // Returns total without tax or shipping for now
}