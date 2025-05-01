import SmallAd from "./SmallAd";


export default function SmallAdContainer() {
  return (
    <div className="px-4 md:px-8 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SmallAd
          imageUrl="/case1.jpeg"
          link="/collections/sale-1"
          title="Sale on Skincare"
        />
        <SmallAd
          imageUrl="/case2.jpeg"
          link="/collections/sale-2"
          title="New Arrivals"
        />
      </div>
    </div>
  );
}
