import ProductCategoriesCard from "./ProductsCategoriesCard";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

async function fetchParentCategories(): Promise<Category[]> {
  try {
    console.log('Fetching parent categories from /api/categories/get-parent-categories');
    const res = await fetch('http://localhost:8383/api/categories/get-parent-categories', {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch parent categories: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Parent categories fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching parent categories:', error);
    throw error; // Rethrow to handle in component
  }
}

export default async function ProductCategories() {
  let categories: Category[] = [];
  let error: string | null = null;

  try {
    categories = await fetchParentCategories();
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Categories</h1>
      {error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      ) : categories.length > 0 ? (
        <ProductCategoriesCard categories={categories} />
      ) : (
        <p className="text-gray-500">No parent categories found.</p>
      )}
    </div>
  );
}