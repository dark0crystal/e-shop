"use client";

import { Star, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function ProductDetails() {
  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Images */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex lg:flex-col gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-20 h-24 border rounded-md overflow-hidden">
              <Image
                src="/product.jpg"
                alt="product thumbnail"
                width={80}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        <div className="flex-1 border rounded-md overflow-hidden">
          <Image
            src="/product.jpg"
            alt="Main product"
            width={500}
            height={600}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Jorpeche Oversize Fit Blazer</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500"><Star fill="currentColor" /></span>
            <span className="font-semibold">4.8</span>
            <span className="text-gray-500">(107 reviews)</span>
          </div>
        </div>

        <div className="text-2xl font-bold text-black">
          $299.00
          <span className="line-through text-gray-400 ml-4 text-lg font-normal">
            $320.00
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="font-medium">Available Colors</p>
            <div className="flex gap-2 mt-1">
              <span className="w-6 h-6 bg-black rounded-full border-2 border-gray-300" />
              <span className="w-6 h-6 bg-white rounded-full border-2" />
            </div>
          </div>

          <div>
            <p className="font-medium">Available Size</p>
            <div className="flex gap-2 mt-1">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className="w-10 h-10 border rounded-md hover:border-black"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <p className="font-medium">Quantity</p>
            <button className="w-8 h-8 border rounded">-</button>
            <span className="w-8 text-center">1</span>
            <button className="w-8 h-8 border rounded">+</button>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-black text-white py-3 rounded-md flex items-center justify-center gap-2">
            <ShoppingCart size={20} />
            Buy it now
          </button>
          <button className="flex-1 border border-black py-3 rounded-md">
            Add to cart
          </button>
        </div>

        <div className="text-sm text-gray-500">
          SKU: GHF758345AA <br />
          Tags: Coat, Fashion, Jacket <br />
          Share:
          <span className="inline-flex gap-2 ml-2">
            {/* Add social icons here */}
          </span>
        </div>
      </div>
    </div>
  );
}
