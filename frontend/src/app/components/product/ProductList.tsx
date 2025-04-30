'use client';

import ProductCard from './ProductCard';
import { products } from './productData';

export default function ProductList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              brand={product.brand} stock_quantity={0}        />
      ))}
    </div>
  );
}
