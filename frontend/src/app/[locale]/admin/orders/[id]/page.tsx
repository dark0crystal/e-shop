"use client";
import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import case1 from "../../../../../../public/case1.jpeg";
import case2 from "../../../../../../public/case2.jpeg";
import case3 from "../../../../../../public/case3.jpeg";

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

type Item = {
  name: string;
  quantity: number;
  price: number;
  image: StaticImageData;
};

const OrderDetails = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const order = {
    id: "ORD123456",
    customerName: "John Doe",
    date: "2025-05-05",
    status: "Shipped",
    items: [
      {
        name: "Wireless Mouse",
        quantity: 2,
        price: 19.99,
        image: case1,
      },
      {
        name: "Mechanical Keyboard",
        quantity: 1,
        price: 89.99,
        image: case2,
      },
      {
        name: "USB-C Cable",
        quantity: 3,
        price: 5.49,
        image: case3,
      },
    ],
  };

  const statusClass = statusColors[order.status] || "bg-gray-100 text-gray-700";
  const total = order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <div className="max-w-[90vw] mx-auto border rounded-xl shadow p-4 space-y-4 relative">
      <h2 className="text-xl font-bold">Order Details</h2>

      <div className="flex justify-between bg-gray-100 rounded-2xl  py-4  px-3">
        <span className="font-medium">Order ID:</span>
        <span>{order.id}</span>
      </div>

      <div className="flex justify-between bg-gray-100 rounded-2xl  py-4 px-3">
        <span className="font-medium">Customer:</span>
        <span>{order.customerName}</span>
      </div>

      <div className="flex justify-between bg-gray-100 rounded-2xl  py-4  px-3">
        <span className="font-medium">Date:</span>
        <span>{order.date}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-medium">Status:</span>
        <span className={`px-2 py-1 rounded-full text-sm ${statusClass}`}>
          {order.status}
        </span>
      </div>

      <h3 className="text-lg font-semibold mt-4">Items</h3>
      <ul className="divide-y">
        {order.items.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <li
              key={index}
              className={`py-4 my-3 px-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg cursor-pointer transition-all duration-500 ease-in-out border ${
                isSelected ? "h-[200px] bg-gray-100 shadow-lg " : "hover:scale-[1.02]"
              }`}
              onClick={() =>
                setSelectedIndex(index === selectedIndex ? null : index)
              }
            >
              <div className="flex items-center gap-4">
                <Image
                  width={200}
                  height={200}
                  src={item.image}
                  alt={item.name}
                  className={isSelected ?'w-3/12 h-3/12 object-cover rounded shadow':'w-16 h-16 object-cover rounded shadow'}
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right sm:text-left">
                <p className="font-semibold">
                  ${(item.quantity * item.price).toFixed(2)}
                </p>
                {isSelected && (
                  <p className="text-sm text-gray-500">
                    Price/unit: ${item.price.toFixed(2)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex justify-between font-bold text-lg  bg-green-100/70 rounded-2xl py-4 mt-6 px-3">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderDetails;
