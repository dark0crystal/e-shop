'use client';

import ProductCard from './ProductCard';
import { products } from './productData';

export default function ProductList() {
  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 max-w-7xl w-full">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            image={product.image}
            brand={product.brand}
            stock_quantity={product.stock_quantity}
          />
        ))}
      </div>
    </div>
  );
}
