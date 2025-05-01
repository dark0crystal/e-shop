import Image from "next/image";
import Link from "next/link";

interface SmallAdProps {
  imageUrl: string;
  link?: string;
  brand?: string;
  title?: string;
}

export default function SmallAd({ imageUrl, link, brand, title }: SmallAdProps) {
  const adCard = (
    <div className="relative w-full aspect-[5.5/5] overflow-hidden shadow-md group transition-all duration-300 ease-in-out transform hover:scale-105">
      <Image
        src={imageUrl}
        alt={title || "Ad"}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/10 p-4 flex flex-col justify-between transition-all duration-300 ease-in-out group-hover:bg-black/30">
        <div>
          {brand && (
            <h2 className="text-white font-semibold text-lg tracking-wide">{brand}</h2>
          )}
          {title && (
            <h3 className="text-white text-2xl font-bold mt-1">{title}</h3>
          )}
        </div>

        <div>
          <Link
            href={link || "#"}
            className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm shadow-lg hover:bg-orange-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full px-2 my-4">
      <Link href={link || "#"} passHref>
        {adCard}
      </Link>
    </div>
  );
}
