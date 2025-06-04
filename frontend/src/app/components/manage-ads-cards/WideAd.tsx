import Image from "next/image";
import Link from "next/link";

export default async function WideAd({ imageUrl, link }: { imageUrl: string; link?: string }) {
  const response = await fetch("http://localhost:8383/ads/get-ads/wide");
  const wideAdImageUrl = await response.json();

  const adImage = (
    <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden  shadow-md">
      <Image
        src={wideAdImageUrl}
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
