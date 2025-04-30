import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  icon: string;
  active?: boolean;
}

export default function CategoryCard({ name, icon, active = false }: CategoryCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-between bg-amber-50 rounded-lg shadow-sm p-4 w-52 h-60 cursor-pointer border hover:shadow-md transition ${
        active ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="relative w-46 h-64 mb-2 over overflow-hidden bg-blue-50">
        <div className='h-full w-full bg-amber-300'>
            <Image src={icon} alt={name} fill objectFit='cover' />
        </div>
      </div>
      <span className="text-sm font-medium text-center">{name}</span>
    </div>
  );
}
