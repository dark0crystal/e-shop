'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cookieData = Cookies.get('cart');
    if (cookieData) {
      try {
        setCartItems(JSON.parse(cookieData));
      } catch (err) {
        console.error('Failed to parse cart cookie:', err);
      }
    }
  }, []);

  const updateCart = (updatedItems: CartItem[]) => {
    setCartItems(updatedItems);
    Cookies.set('cart', JSON.stringify(updatedItems), { expires: 7 });
  };

  const increaseQty = (id: string) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    updateCart(updated);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return <div className="p-8 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border p-4 rounded-lg shadow-sm bg-white">
            <div className="relative w-24 h-24">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain rounded-md"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-md">{item.name}</h2>
              <p className="text-sm text-gray-500 mb-2">Price: ${item.price.toFixed(2)}</p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                >
                  –
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="text-right font-bold text-lg">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <button className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
          Checkout
        </button>
      </div>
    </div>
  );
}
