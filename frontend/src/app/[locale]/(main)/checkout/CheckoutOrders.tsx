'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface CartItem {
  id: string;
  productItemId: string;
  productName: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CheckOutOrders() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        // Check if user is logged in by fetching session with JWT
        const token = localStorage.getItem('token');
        if (token) {
          // Logged-in user: Fetch cart from backend
          const response = await fetch('http://localhost:8383/api/cart', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            if (response.status === 401) {
              localStorage.removeItem('token'); // Clear invalid token
              throw new Error('Session expired. Please log in again.');
            }
            throw new Error('Failed to fetch cart from database');
          }

          const cartData = await response.json();
          setCart(cartData);
        } else {
          // Guest user: Fetch cart from cookies
          const cartCookie = Cookies.get('cart') || '[]';
          const cartItems = JSON.parse(cartCookie) as CartItem[];
          setCart(cartItems);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching the cart');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (cart.length === 0) {
    return <div className="p-6 text-center text-gray-600">Your cart is empty.</div>;
  }

  const totalPrice = CalculateTotalPrice(cart);
  const { discountedPrice, discountAmount } = ApplyDiscount(totalPrice, 10);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Order</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              <Image
                src={item.image_url}
                alt={item.productName}
                width={64}
                height={64}
                className="object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)}</p>
              </div>
            </div>
            <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
        <div className="space-y-2">
          <p>Subtotal: ${totalPrice.toFixed(2)}</p>
          <p>Discount: -${discountAmount.toFixed(2)}</p>
          <p className="text-lg font-bold">Total: ${discountedPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

function CalculateTotalPrice(cart: CartItem[]): number {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Number(subtotal.toFixed(2));
}

function ApplyDiscount(
  totalPrice: number,
  discountRate: number = 0,
  customDiscount: number = 0
): { discountedPrice: number; discountAmount: number } {
  const discountAmount = Math.min(
    totalPrice * (discountRate / 100) + customDiscount,
    totalPrice
  );
  const discountedPrice = Math.max(totalPrice - discountAmount, 0);
  return {
    discountedPrice: Number(discountedPrice.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
  };
}