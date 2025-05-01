// components/WideAd.tsx
import Image from "next/image";
import Link from "next/link";

export default function WideAd({ imageUrl, link }: { imageUrl: string; link?: string }) {
  const adImage = (
    <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl shadow-md">
      <Image
        src={imageUrl}
        alt="Wide Ad Banner"
        fill
        className="object-cover"
        priority
      />
    </div>
  );

  return (
    <div className="px-4 md:px-8 my-6">
      {link ? (
        <Link href={link} className="block">
          {adImage}
        </Link>
      ) : (
        adImage
      )}
    </div>
  );
}
