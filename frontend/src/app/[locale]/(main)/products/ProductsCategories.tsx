import ProductCategoriesCard from "./ProductsCategoriesCard";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

async function fetchParentCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:8383/api/categories/get-parent-categories', {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch parent categories');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    return [];
  }
}

export default async function ProductCategories() {
  const categories = await fetchParentCategories();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Categories</h1>
      {categories.length > 0 ? (
        <ProductCategoriesCard categories={categories} />
      ) : (
        <p className="text-gray-500">No parent categories found.</p>
      )}
    </div>
  );
}