'use client';

import { useState } from 'react';
import { v4 as uuid } from 'uuid';

type Variant = {
  id: string;
  name: string;
  options: { id: string; value: string }[];
};

export default function ManageCategories() {
  const [categories, setCategories] = useState([
    { id: uuid(), name: '', parentId: '' },
  ]);
  const [variations, setVariations] = useState<Variant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'child' | 'variant' | null>(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);

  // Form state
  const [childName, setChildName] = useState('');
  const [variantList, setVariantList] = useState<Variant[]>([]);

  const openModal = (type: 'child' | 'variant', parentId: string) => {
    setModalType(type);
    setCurrentParentId(parentId);
    setChildName('');
    setVariantList([
      { id: uuid(), name: '', options: [{ id: uuid(), value: '' }] },
    ]);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setCurrentParentId(null);
    setVariantList([]);
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

  const handleSubmit = () => {
    if (!currentParentId) return;

    if (modalType === 'child') {
      const newChildId = uuid();
      setCategories((prev) => [
        ...prev,
        { id: newChildId, name: childName, parentId: currentParentId },
      ]);
      const variantsToAdd = variantList.map((v) => ({
        ...v,
        categoryId: newChildId,
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
      <h1 className="text-xl font-bold mb-4">Manage Categories</h1>

      {parentCategories.map((parent) => (
        <div
          key={parent.id}
          className="bg-gray-100 p-4 rounded-xl mb-4 shadow"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{parent.name}</h2>
            <button
              onClick={() => openModal('child', parent.id)}
              className="bg-blue-600 text-white px-2 py-1 rounded"
            >
              + Add Child
            </button>
          </div>

          {childCategories(parent.id).map((child) => (
            <div key={child.id} className="ml-4 mt-2 bg-white p-3 rounded">
              <div className="flex justify-between items-center">
                <h3>{child.name}</h3>
                <button
                  onClick={() => openModal('variant', child.id)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
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
              {modalType === 'child' ? 'Add Child Category' : 'Add Variants'}
            </h2>

            {modalType === 'child' && (
              <>
                <input
                  type="text"
                  placeholder="Child category name"
                  className="border p-2 rounded w-full mb-4"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                />
              </>
            )}

            {variantList.map((variant, vIndex) => (
              <div key={variant.id} className="mb-4">
                <input
                  type="text"
                  placeholder="Variant name (e.g. Size)"
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
                  className="text-blue-600 text-sm mt-1"
                >
                  + Add Option
                </button>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button
                onClick={handleAddVariant}
                className="text-green-600 font-medium"
              >
                + Add Another Variant
              </button>
              <div className="flex gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
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
