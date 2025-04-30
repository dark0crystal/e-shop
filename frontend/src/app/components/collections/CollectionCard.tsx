'use client'
import Image from "next/image";

type CollectionCardProps = {
  image: string;
  name: string;
  onShopNow?: () => void;
};

export default function CollectionCard({ image, name, onShopNow }: CollectionCardProps) {
  return (
    <div className="max-w-sm overflow-hidden shadow-md bg-white">
      <Image
        src={image}
        alt={name}
        width={400}
        height={192}
        className="object-cover w-full h-48"
      />
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-2xl font-black mb-2">{name}</h2>
        <button
          onClick={onShopNow}
          className="px-4 py-2 bg-black text-white text-md font-bold hover:bg-gray-800 transition"
        >
          SHOP NOW
        </button>
      </div>
    </div>
  );
}
