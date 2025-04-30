import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  icon: string;
  active?: boolean;
}

export default function CategoryCard({ name, icon, active = false }: CategoryCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-between bg-gray-100 rounded-lg shadow-sm min-w-52 h-60 cursor-pointer border hover:shadow-md transition overflow-hidden ${
        active ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="relative w-54 h-64 mb-2 over overflow-hidden ">
        <div className='absolute top-2 left-8 h-full w-full '>
            <Image src={icon} alt={name} fill objectFit='contain'  />
        </div>
      </div>
      <span className="text-lg font-semibold text-center">{name}</span>
    </div>
  );
}
