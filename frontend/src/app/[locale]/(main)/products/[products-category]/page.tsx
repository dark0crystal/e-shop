import { notFound } from 'next/navigation';
import Image from 'next/image';

// Simulated product data import (replace with real DB call in prod)
import { products } from '@/app/components/product/productData'; // Adjust path as needed

interface ProductsCategoryProps {
  params: { productId: string };
}

export default function ProductsCategory({ params }: ProductsCategoryProps) {
  const product = products.find((p) => p.id === params.productId);

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative w-full h-96 bg-gray-50 rounded-md">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain rounded-md"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-4">Brand: {product.brand}</p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-xl font-bold text-orange-600">
              ${product.price.toFixed(2)}
            </span>
            {product.stock_quantity > 0 ? (
              <span className="text-sm text-green-600">In Stock</span>
            ) : (
              <span className="text-sm text-red-500">Out of Stock</span>
            )}
          </div>

          <button className="mt-4 bg-black text-white px-6 py-2 font-semibold rounded hover:bg-gray-800 transition">
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}
