import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Assume 1 main image per product for now
  brand: string;
  stock_quantity: number;
}

export default function ProductCard({
 
  name,
  description,
  price,
  image,
  brand,
  stock_quantity,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-64 hover:shadow-lg transition">
      <div className="relative w-full h-40 mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain rounded-md"
        />
      </div>

      <h3 className="text-sm font-semibold line-clamp-1">{name}</h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{description}</p>

      <div className="flex justify-between items-center">
        <span className="text-blue-600 font-bold text-md">${price.toFixed(2)}</span>
        <span className={`text-xs ${stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
          {stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <p className="text-[10px] text-gray-400 mt-1">Brand: {brand}</p>
    </div>
  );
}
