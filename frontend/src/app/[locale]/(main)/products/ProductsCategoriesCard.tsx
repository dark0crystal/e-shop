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
          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{category.description}</p>
            <Link
              href={`/admin/products?categoryId=${category.id}`}
              locale={locale}
              className="inline-block bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              View Products
            </Link>
          </div>
          <div className="bg-gray-100 px-6 py-3 text-sm text-gray-500">
            Slug: {category.slug}
          </div>
        </div>
      ))}
    </div>
  );
}