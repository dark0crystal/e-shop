'use client';

import { useState, useEffect } from 'react';
import { Link } from "@/i18n/routing";
import ProductCard from "../ui/cards/ProductCard";
import { useLocale } from "next-intl";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  stock_total: number;
  image_url: string;
  active: boolean;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch('http://localhost:8383/api/categories/all-categories-variants', {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await res.json();

    // Map categories and subcategories
    const categories: Category[] = [];
    data.forEach((parent: any) => {
      categories.push({ id: parent.id, name: parent.name, parentId: null });
      parent.subcategories.forEach((child: any) => {
        categories.push({ id: child.id, name: child.name, parentId: parent.id });
      });
    });
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const res = await fetch(`http://localhost:8383/api/product/by-category/${categoryId}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default function Products() {
  const locale = useLocale().substring(0, 2);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      if (fetchedCategories.length > 0) {
        setSelectedCategoryId(fetchedCategories[0].id); // Default to first category
      }
      setLoading(false);
    }
    loadCategories();
  }, []);

  // Fetch products when selectedCategoryId changes
  useEffect(() => {
    if (!selectedCategoryId) return;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      const fetchedProducts = await fetchProductsByCategory(selectedCategoryId);
      setProducts(fetchedProducts);
      setLoading(false);
    }
    loadProducts();
  }, [selectedCategoryId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products/new" locale={locale}>
            <h1 className="bg-blue-500 p-3 rounded-3xl w-fit text-white font-bold flex items-center gap-2">
              <Plus size={20} />
              New Product
            </h1>
          </Link>
          <div>
            <label htmlFor="categorySelect" className="text-sm font-medium text-gray-700 mr-2">
              Select Category:
            </label>
            <select
              id="categorySelect"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={categories.length === 0 || loading}
            >
              {categories.length === 0 && !loading && (
                <option value="">No categories available</option>
              )}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.parentId ? `└─ ${category.name}` : category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <div>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : products.length > 0 ? (
            <ProductCard products={products} />
          ) : (
            <p className="text-gray-500">No products found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}