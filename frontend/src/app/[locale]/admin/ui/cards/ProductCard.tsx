'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import case1 from "../../../../../../public/case1.jpeg";
import case2 from "../../../../../../public/case2.jpeg";
import case3 from "../../../../../../public/case3.jpeg";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  stock_total: number;
  image_url: StaticImageData;
  active: boolean;
}

export default function ProductCard() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([
    {
      id: "p1",
      name: "Oversized Heritage Washed Shirt",
      price: 64.15,
      stock_quantity: 900,
      stock_total: 1000,
      image_url: case1,
      active: true,
    },
    {
      id: "p2",
      name: "Sweatshirt With Hood",
      price: 74.34,
      stock_quantity: 400,
      stock_total: 1000,
      image_url: case2,
      active: true,
    },
    {
      id: "p3",
      name: "Soft and Light Break",
      price: 54.21,
      stock_quantity: 420,
      stock_total: 1000,
      image_url: case3,
      active: false,
    },
  ]);

  const toggleStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      )
    );
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

        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.id)}
            className="cursor-pointer bg-gray-100 shadow-sm grid grid-cols-6 items-center px-3 py-4 rounded-2xl hover:bg-gray-50 transition my-3"
          >
            {/* Product info */}
            <div className="col-span-2 flex items-center gap-3">
              <Image
                src={product.image_url}
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
                  product.active ? "text-green-600" : "text-gray-400"
                }`}
              >
                {product.active ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Toggle button */}
            <div onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => toggleStatus(product.id)}
                className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                  product.active ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-0 top-0.5 h-4 w-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    product.active ? "translate-x-5" : "translate-x-0.5"
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
