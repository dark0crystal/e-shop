'use client';

import { useState, useEffect } from 'react';
import ProductCategoriesCard from "./ProductsCategoriesCard";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default function ProductCategories() {
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching parent categories from /api/categories/get-parent-categories');
        const res = await fetch('http://localhost:8383/api/categories/get-parent-categories');
        if (!res.ok) {
          throw new Error(`Failed to fetch parent categories: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Parent categories fetched:', data);
        setParentCategories(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Error fetching parent categories:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product Categories</h1>
      {loading ? (
        <p className="text-gray-500">Loading categories...</p>
      ) : error ? (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          Error: {error}
        </div>
      ) : parentCategories.length > 0 ? (
        <ProductCategoriesCard categories={parentCategories} />
      ) : (
        <p className="text-gray-500">No parent categories found.</p>
      )}
    </div>
  );
}