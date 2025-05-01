'use client'
import CollectionCard from "./CollectionCard";
import caseImage from "../../../../public/case1.jpeg";

const collections = [
  {
    id: 1,
    name: "Summer Collection",
    image: caseImage,
  },
  {
    id: 2,
    name: "Winter Collection",
    image: caseImage,
  },
  {
    id: 3,
    name: "Spring Collection",
    image: caseImage,
  },
];

export default function CollectionCardList() {
  const handleShopNow = (collectionName: string) => {
    alert(`Redirecting to ${collectionName}`);
  };

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-4">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            name={collection.name}
            image={collection.image}
            onShopNow={() => handleShopNow(collection.name)}
          />
        ))}
      </div>
    </div>
  );
}
