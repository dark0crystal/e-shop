'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';

export default function ManageCategories() {
  const [categories, setCategories] = useState([
    { id: uuid(), name: 'Clothing', parentId: '' },
    { id: uuid(), name: 'T-Shirt', parentId: '' }, // we'll change this to child below
  ]);

  const [variations, setVariations] = useState([
    {
      id: uuid(),
      categoryId: '', // set dynamically
      name: 'Size',
      options: [{ id: uuid(), value: 'S' }],
    },
  ]);

  const handleAddParentCategory = () => {
    const name = prompt('Enter parent category name:');
    if (!name) return;
    setCategories([...categories, { id: uuid(), name, parentId: '' }]);
  };

  const handleAddChildCategory = (parentId: string) => {
    const name = prompt('Enter child category name:');
    if (!name) return;
    setCategories([...categories, { id: uuid(), name, parentId }]);
  };

  const handleDeleteCategory = (categoryId: string) => {
    // Remove category and children
    setCategories((prev) =>
      prev.filter((cat) => cat.id !== categoryId && cat.parentId !== categoryId)
    );
    setVariations((prev) => prev.filter((v) => v.categoryId !== categoryId));
  };

  const handleAddVariation = (categoryId: string) => {
    const name = prompt('Enter variation name (e.g. Size):');
    const option = prompt('Enter first option value (e.g. M):');
    if (!name || !option) return;

    setVariations([
      ...variations,
      {
        id: uuid(),
        categoryId,
        name,
        options: [{ id: uuid(), value: option }],
      },
    ]);
  };

  const handleDeleteVariation = (variationId: string) => {
    setVariations((prev) => prev.filter((v) => v.id !== variationId));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Categories</h1>
      <button
        onClick={handleAddParentCategory}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        + Add Parent Category
      </button>

      {categories
        .filter((cat) => cat.parentId === '')
        .map((parent) => (
          <div key={parent.id} className="bg-gray-100 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{parent.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddChildCategory(parent.id)}
                  className="bg-green-500 text-white px-2 rounded"
                >
                  + Child
                </button>
                <button
                  onClick={() => handleDeleteCategory(parent.id)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  🗑
                </button>
              </div>
            </div>

            {categories
              .filter((child) => child.parentId === parent.id)
              .map((child) => {
                const childVariations = variations.filter((v) => v.categoryId === child.id);
                return (
                  <div key={child.id} className="bg-white rounded-lg p-3 mt-2 ml-4 shadow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{child.name}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddVariation(child.id)}
                          className="bg-indigo-500 text-white px-2 rounded"
                        >
                          + Variant
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(child.id)}
                          className="bg-red-400 text-white px-2 rounded"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {childVariations.length > 0 ? (
                      <div className="ml-4 mt-2">
                        {childVariations.map((variation) => (
                          <div key={variation.id} className="mb-1">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold">{variation.name}:</p>
                              <button
                                onClick={() => handleDeleteVariation(variation.id)}
                                className="text-red-500 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                            <ul className="list-disc list-inside text-sm">
                              {variation.options.map((opt) => (
                                <li key={opt.id}>{opt.value}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No variants</p>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
    </div>
  );
}
