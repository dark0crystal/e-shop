'use client';

import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useState } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  brand: string;
  stock_quantity: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  image,
  brand,
  stock_quantity,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering navigation
    e.preventDefault(); // Prevent default link behavior

    const cart = JSON.parse(Cookies.get('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === id);

    if (!existingItem) {
      cart.push({ id, name, price, image, quantity: 1 });
    } else {
      existingItem.quantity += 1;
    }

    Cookies.set('cart', JSON.stringify(cart), { expires: 7 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/product/${id}`} className="block">
      <div className="bg-white shadow-md p-4 w-full sm:max-w-xs mx-auto hover:shadow-lg transition relative flex flex-col">
        {/* Product Image */}
        <div className="relative w-full h-40 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain rounded-md"
          />
        </div>

        {/* Product Info */}
        <h3 className="text-sm font-semibold line-clamp-1 uppercase">{brand}</h3>
        <p className="text-xs font-semibold line-clamp-2">{name}</p>

        <div className="flex items-baseline gap-2 mt-1 mb-2">
          <span className="text-sm line-through text-gray-400">$9.00</span>
          <span className="text-md text-orange-600 font-bold">${price.toFixed(2)}</span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="mt-auto border border-black font-semibold text-sm py-2 hover:bg-black hover:text-white transition"
        >
          {added ? 'Added!' : 'Add To Cart'}
        </button>

        {/* Stock status */}
        <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded ${stock_quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </Link>
  );
}
