'use client';

import { useRef } from 'react';
import CategoryCard from './CategoryCard';
import { categories } from './categoryData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white shadow-sm border-t border-b">
      {/* Scroll buttons */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 rounded-full"
        onClick={() => scroll('left')}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-1 rounded-full"
        onClick={() => scroll('right')}
      >
        <ChevronRight size={24} />
      </button>

      {/* Scrollable category list */}
      <div
        ref={scrollRef}
        className="flex gap-4 px-10 py-2 overflow-x-auto scroll-smooth whitespace-nowrap no-scrollbar"
      >
        {categories.map((cat) => (
          <CategoryCard key={cat.id} name={cat.name} icon={cat.icon} />
        ))}
      </div>
    </div>
  );
}
