'use client';

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

interface ProductCategoriesCardProps {
  categories: Category[];
}

export default function ProductCategoriesCard({ categories }: ProductCategoriesCardProps) {
  const locale = useLocale().substring(0, 2);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{category.name}</h2>
            <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">{category.description}</p>
            <Link
              href={`/products/${category.slug}`}
              locale={locale}
              className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              View Products
            </Link>
          </div>
          <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500 border-t border-gray-100">
            Slug: {category.slug}
          </div>
        </div>
      ))}
    </div>
  );
}