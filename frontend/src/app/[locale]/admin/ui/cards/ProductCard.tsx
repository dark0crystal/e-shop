'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  stock_total: number;
  image_url: string; // Changed to string for Supabase URLs
  active: boolean;
}

async function toggleProductStatus(id: string, currentStatus: boolean) {
  try {
    const res = await fetch(`http://localhost:8383/api/product/toggle-status/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: !currentStatus }),
    });
    if (!res.ok) {
      throw new Error('Failed to toggle product status');
    }
    return true;
  } catch (error) {
    console.error('Error toggling product status:', error);
    return false;
  }
}

export default function ProductCard({ products }: { products: Product[] }) {
  const [productList, setProductList] = useState<Product[]>(products);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const success = await toggleProductStatus(id, currentStatus);
      if (success) {
        // Optimistically update the UI
        setProductList((prev) =>
          prev.map((p) => (p.id === id ? { ...p, active: !currentStatus } : p))
        );
      } else {
        // Show error message
        alert('Failed to toggle product status');
      }
    });
  };

  const handleCardClick = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  return (
    <div className="p-6">
      <div className="overflow-hidden">
        <div className="grid grid-cols-6 bg-gray-50 text-sm font-semibold text-gray-600 p-3">
          <div className="col-span-2">Product Info</div>
          <div>Price</div>
          <div>Stock</div>
          <div>Status</div>
          <div>Toggle</div>
        </div>

        {productList.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.id)}
            className="cursor-pointer bg-gray-100 shadow-sm grid grid-cols-6 items-center px-3 py-4 rounded-2xl hover:bg-gray-50 transition my-3"
          >
            {/* Product info */}
            <div className="col-span-2 flex items-center gap-3">
              <Image
                src={product.image_url || '/placeholder.jpg'}
                alt={product.name}
                width={48}
                height={48}
                className="rounded-md object-cover"
              />
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-xs text-gray-500">ID: {product.id}</p>
              </div>
            </div>

            {/* Price */}
            <div>SAR {product.price.toFixed(2)}</div>

            {/* Stock quantity */}
            <div>
              <p className="text-sm text-gray-700">{product.stock_quantity}</p>
            </div>

            {/* Status label */}
            <div>
              <span
                className={`text-sm font-medium ${
                  product.active ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {product.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Toggle button */}
            <div onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleToggleStatus(product.id, product.active)}
                disabled={isPending}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  product.active ? 'bg-green-500' : 'bg-gray-300'
                } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`absolute left-0 top-0.5 h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    product.active ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}