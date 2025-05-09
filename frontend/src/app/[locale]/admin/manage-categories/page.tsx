'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';

type Variant = {
  id: string;
  name: string;
  options: { id: string; value: string }[];
  categoryId?: string;
};

type Category = {
  id: string;
  name: string;
  parentId: string;
};

export default function ManageCategories() {
  const [categories, setCategories] = useState<Category[]>([
    { id: uuid(), name: '', parentId: '' },
  ]);
  const [variations, setVariations] = useState<Variant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'parent' | 'child' | 'variant' | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Form state
  const [parentName, setParentName] = useState('');
  const [parentSlug, setParentSlug] = useState('');
  const [childName, setChildName] = useState('');
  const [childSlug, setChildSlug] = useState('');
  const [variantList, setVariantList] = useState<Variant[]>([]);

  const openModal = (type: 'parent' | 'child' | 'variant', parentId?: string) => {
    setModalType(type);
    setCurrentParentId(parentId || null);
    setParentName('');
    setParentSlug('');
    setChildName('');
    setChildSlug('');
    setVariantList([
      { id: uuid(), name: '', options: [{ id: uuid(), value: '' }] },
    ]);
    setSubmissionError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setCurrentParentId(null);
    setVariantList([]);
    setSubmissionError(null);
  };

  const handleAddOption = (variantIndex: number) => {
    setVariantList((prev) => {
      const updated = [...prev];
      updated[variantIndex].options.push({ id: uuid(), value: '' });
      return updated;
    });
  };

  const handleAddVariant = () => {
    setVariantList((prev) => [
      ...prev,
      { id: uuid(), name: '', options: [{ id: uuid(), value: '' }] },
    ]);
  };

  const handleSubmit = async () => {
    setSubmissionError(null);

    if (modalType === 'parent') {
      if (!parentName || !parentSlug) {
        setSubmissionError('Parent category name and slug are required');
        return;
      }
      try {
        const res = await fetch('http://localhost:8383/api/categories/add-parent-category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: parentName,
            slug: parentSlug,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to add parent category');
        }

        const data = await res.json();
        const newCategory = data.newCategory;

        setCategories((prev) => [
          ...prev,
          { id: newCategory.id, name: newCategory.name, parentId: '' },
        ]);
      } catch (error: any) {
        console.error('Failed to add parent category', error);
        setSubmissionError(error.message || 'Failed to add parent category');
        return;
      }
    }

    if (modalType === 'child') {
      if (!currentParentId || !childName || !childSlug) {
        setSubmissionError('Child category name, slug, and parent category are required');
        return;
      }
      try {
        const res = await fetch('http://localhost:8383/api/categories/add-child-category', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: childName,
            slug: childSlug,
            parentCategoryId: currentParentId,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to add child category');
        }

        const data = await res.json();
        const newChildCategory = data.childCategory;

        const newChildId = newChildCategory.id;
        setCategories((prev) => [
          ...prev,
          { id: newChildId, name: childName, parentId: currentParentId },
        ]);

        const variantsToAdd = variantList
          .filter((v) => v.name && v.options.some((o) => o.value))
          .map((v) => ({
            ...v,
            categoryId: newChildId,
          }));
        setVariations((prev) => [...prev, ...variantsToAdd]);
      } catch (error: any) {
        console.error('Failed to add child category', error);
        setSubmissionError(error.message || 'Failed to add child category');
        return;
      }
    }

    if (modalType === 'variant') {
      if (!currentParentId) {
        setSubmissionError('Child category selection is required');
        return;
      }
      const variantsToAdd = variantList
        .filter((v) => v.name && v.options.some((o) => o.value))
        .map((v) => ({
          ...v,
          categoryId: currentParentId,
        }));
      setVariations((prev) => [...prev, ...variantsToAdd]);
    }

    closeModal();
  };

  const parentCategories = categories.filter((cat) => !cat.parentId);
  const childCategories = (parentId: string) =>
    categories.filter((cat) => cat.parentId === parentId);
  const getVariations = (categoryId: string) =>
    variations.filter((v) => v.categoryId === categoryId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Categories</h1>
        <button
          onClick={() => openModal('parent')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Parent Category
        </button>
      </div>

      {parentCategories.map((parent) => (
        <div key={parent.id} className="bg-gray-100 p-4 rounded-xl mb-4 shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{parent.name || 'Unnamed Category'}</h2>
            <button
              onClick={() => openModal('child', parent.id)}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              + Add Child
            </button>
          </div>

          {childCategories(parent.id).map((child) => (
            <div key={child.id} className="ml-4 mt-2 bg-white p-3 rounded">
              <div className="flex justify-between items-center">
                <h3>{child.name || 'Unnamed Child Category'}</h3>
                <button
                  onClick={() => openModal('variant', child.id)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                >
                  + Add Variants
                </button>
              </div>
              <ul className="mt-2 text-sm ml-4 list-disc">
                {getVariations(child.id).map((v) => (
                  <li key={v.id}>
                    {v.name}: {v.options.map((o) => o.value).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {modalType === 'parent'
                ? 'Add Parent Category'
                : modalType === 'child'
                ? 'Add Child Category'
                : 'Add Variants'}
            </h2>

            {submissionError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {submissionError}
              </div>
            )}

            {modalType === 'parent' && (
              <>
                <input
                  type="text"
                  placeholder="Parent category name"
                  className="border p-2 rounded w-full mb-2"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Slug (e.g., electronics)"
                  className="border p-2 rounded w-full mb-4"
                  value={parentSlug}
                  onChange={(e) => setParentSlug(e.target.value)}
                />
              </>
            )}

            {modalType === 'child' && (
              <>
                <input
                  type="text"
                  placeholder="Child category name"
                  className="border p-2 rounded w-full mb-2"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Slug (e.g., t-shirts)"
                  className="border p-2 rounded w-full mb-4"
                  value={childSlug}
                  onChange={(e) => setChildSlug(e.target.value)}
                />
              </>
            )}

            {(modalType === 'child' || modalType === 'variant') &&
              variantList.map((variant, vIndex) => (
                <div key={variant.id} className="mb-4">
                  <input
                    type="text"
                    placeholder="Variant name (e.g., Size)"
                    className="border p-2 rounded w-full mb-2"
                    value={variant.name}
                    onChange={(e) => {
                      const updated = [...variantList];
                      updated[vIndex].name = e.target.value;
                      setVariantList(updated);
                    }}
                  />
                  {variant.options.map((opt, oIndex) => (
                    <input
                      key={opt.id}
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      className="border p-2 rounded w-full mb-1"
                      value={opt.value}
                      onChange={(e) => {
                        const updated = [...variantList];
                        updated[vIndex].options[oIndex].value = e.target.value;
                        setVariantList(updated);
                      }}
                    />
                  ))}
                  <button
                    onClick={() => handleAddOption(vIndex)}
                    className="text-blue-600 text-sm mt-1 hover:underline"
                  >
                    + Add Option
                  </button>
                </div>
              ))}

            <div className="flex justify-between mt-4">
              {(modalType === 'child' || modalType === 'variant') && (
                <button
                  onClick={handleAddVariant}
                  className="text-green-600 font-medium hover:underline"
                >
                  + Add Another Variant
                </button>
              )}
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}