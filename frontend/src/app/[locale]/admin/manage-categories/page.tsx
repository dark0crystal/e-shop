'use client';

import { useState, useEffect } from 'react';
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [variations, setVariations] = useState<Variant[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    | 'parent'
    | 'child'
    | 'variant'
    | 'option'
    | 'edit-parent'
    | 'edit-child'
    | 'edit-variant'
    | 'edit-option'
    | null
  >(null);
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Form state
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [variantList, setVariantList] = useState<Variant[]>([]);
  const [selectedVariationId, setSelectedVariationId] = useState<string>('');
  const [newOptions, setNewOptions] = useState<{ id: string; value: string }[]>([
    { id: uuid(), value: '' },
  ]);
  const [editId, setEditId] = useState<string>('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:8383/api/categories/all-categories-variants');
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();

        // Map categories and variations
        const fetchedCategories: Category[] = [];
        const fetchedVariations: Variant[] = [];

        data.forEach((parent: any) => {
          fetchedCategories.push({
            id: parent.id,
            name: parent.name,
            parentId: '',
          });

          parent.variation.forEach((v: any) => {
            fetchedVariations.push({
              id: v.id,
              name: v.name,
              categoryId: parent.id,
              options: v.variationOption.map((o: any) => ({
                id: o.id,
                value: o.value,
              })),
            });
          });

          parent.subcategories.forEach((child: any) => {
            fetchedCategories.push({
              id: child.id,
              name: child.name,
              parentId: parent.id,
            });

            child.variation.forEach((v: any) => {
              fetchedVariations.push({
                id: v.id,
                name: v.name,
                categoryId: child.id,
                options: v.variationOption.map((o: any) => ({
                  id: o.id,
                  value: o.value,
                })),
              });
            });
          });
        });

        setCategories(fetchedCategories);
        setVariations(fetchedVariations);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setSubmissionError(error.message || 'Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const openModal = (
    type: 'parent' | 'child' | 'variant' | 'option' | 'edit-parent' | 'edit-child' | 'edit-variant' | 'edit-option',
    parentId?: string,
    editData?: { id: string; name?: string; value?: string }
  ) => {
    setModalType(type);
    setCurrentParentId(parentId || null);
    setParentName(editData?.name || '');
    setChildName(editData?.name || '');
    setVariantList(
      editData?.name
        ? [{ id: uuid(), name: editData.name, options: [{ id: uuid(), value: '' }] }]
        : [{ id: uuid(), name: '', options: [{ id: uuid(), value: '' }] }]
    );
    setSelectedVariationId('');
    setNewOptions(
      editData?.value ? [{ id: uuid(), value: editData.value }] : [{ id: uuid(), value: '' }]
    );
    setEditId(editData?.id || '');
    setSubmissionError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setCurrentParentId(null);
    setVariantList([]);
    setSelectedVariationId('');
    setNewOptions([{ id: uuid(), value: '' }]);
    setEditId('');
    setSubmissionError(null);
  };

  const handleAddOption = (variantIndex: number) => {
    setVariantList((prev) => {
      const updated = [...prev];
      updated[variantIndex].options.push({ id: uuid(), value: '' });
      return updated;
    });
  };

  const handleAddNewOptionInput = () => {
    setNewOptions((prev) => [...prev, { id: uuid(), value: '' }]);
  };

  const handleNewOptionChange = (index: number, value: string) => {
    setNewOptions((prev) => {
      const updated = [...prev];
      updated[index].value = value;
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
      if (!parentName) {
        setSubmissionError('Parent category name is required');
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
      if (!currentParentId || !childName) {
        setSubmissionError('Child category name and parent category are required');
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
            id: uuid(),
            name: v.name,
            options: v.options.filter((o) => o.value),
            categoryId: newChildId,
          }));

        for (const variant of variantsToAdd) {
          const res = await fetch('http://localhost:8383/api/categories/add-variant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: variant.name,
              categoryId: newChildId,
              options: variant.options.map((o) => o.value),
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add variant');
          }

          const data = await res.json();
          variant.id = data.variation.id;
        }

        setVariations((prev) => [...prev, ...variantsToAdd]);
      } catch (error: any) {
        console.error('Failed to add child category or variants', error);
        setSubmissionError(error.message || 'Failed to add child category or variants');
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
          id: uuid(),
          name: v.name,
          options: v.options.filter((o) => o.value),
          categoryId: currentParentId,
        }));

      try {
        for (const variant of variantsToAdd) {
          const res = await fetch('http://localhost:8383/api/categories/add-variant', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: variant.name,
              categoryId: currentParentId,
              options: variant.options.map((o) => o.value),
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add variant');
          }

          const data = await res.json();
          variant.id = data.variation.id;
        }

        setVariations((prev) => [...prev, ...variantsToAdd]);
      } catch (error: any) {
        console.error('Failed to add variants', error);
        setSubmissionError(error.message || 'Failed to add variants');
        return;
      }
    }

    if (modalType === 'option') {
      if (!currentParentId || !selectedVariationId) {
        setSubmissionError('Variation selection is required');
        return;
      }
      const validOptions = newOptions.filter((opt) => opt.value).map((opt) => opt.value);
      if (validOptions.length === 0) {
        setSubmissionError('At least one non-empty option is required');
        return;
      }

      try {
        const res = await fetch('http://localhost:8383/api/categories/add-variation-options', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            variationId: selectedVariationId,
            options: validOptions,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to add variation options');
        }

        const data = await res.json();
        const newOptionsFromResponse = data.options;

        setVariations((prev) =>
          prev.map((v) =>
            v.id === selectedVariationId
              ? { ...v, options: [...v.options, ...newOptionsFromResponse] }
              : v
          )
        );
      } catch (error: any) {
        console.error('Failed to add variation options', error);
        setSubmissionError(error.message || 'Failed to add variation options');
        return;
      }
    }

    if (modalType === 'edit-parent') {
      if (!parentName) {
        setSubmissionError('Parent category name is required');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8383/api/categories/edit-parent-category/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: parentName,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update parent category');
        }

        const data = await res.json();
        const updatedCategory = data.updatedCategory;

        setCategories((prev) =>
          prev.map((c) => (c.id === editId ? { ...c, name: updatedCategory.name } : c))
        );
      } catch (error: any) {
        console.error('Failed to update parent category', error);
        setSubmissionError(error.message || 'Failed to update parent category');
        return;
      }
    }

    if (modalType === 'edit-child') {
      if (!childName) {
        setSubmissionError('Child category name is required');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8383/api/categories/edit-child-category/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: childName,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update child category');
        }

        const data = await res.json();
        const updatedCategory = data.updatedCategory;

        setCategories((prev) =>
          prev.map((c) => (c.id === editId ? { ...c, name: updatedCategory.name } : c))
        );
      } catch (error: any) {
        console.error('Failed to update child category', error);
        setSubmissionError(error.message || 'Failed to update child category');
        return;
      }
    }

    if (modalType === 'edit-variant') {
      if (!variantList[0].name) {
        setSubmissionError('Variant name is required');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8383/api/categories/edit-variant/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: variantList[0].name,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update variant');
        }

        const data = await res.json();
        const updatedVariation = data.updatedVariation;

        setVariations((prev) =>
          prev.map((v) => (v.id === editId ? { ...v, name: updatedVariation.name } : v))
        );
      } catch (error: any) {
        console.error('Failed to update variant', error);
        setSubmissionError(error.message || 'Failed to update variant');
        return;
      }
    }

    if (modalType === 'edit-option') {
      if (!newOptions[0].value) {
        setSubmissionError('Option value is required');
        return;
      }
      try {
        const res = await fetch(`http://localhost:8383/api/categories/edit-variation-option/${editId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: newOptions[0].value,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to update variation option');
        }

        const data = await res.json();
        const updatedOption = data.updatedOption;

        setVariations((prev) =>
          prev.map((v) =>
            v.options.some((o) => o.id === editId)
              ? {
                  ...v,
                  options: v.options.map((o) =>
                    o.id === editId ? { ...o, value: updatedOption.value } : o
                  ),
                }
              : v
          )
        );
      } catch (error: any) {
        console.error('Failed to update variation option', error);
        setSubmissionError(error.message || 'Failed to update variation option');
        return;
      }
    }

    closeModal();
  };

  const handleDelete = async (
    type: 'parent' | 'child' | 'variant' | 'option',
    id: string
  ) => {
    try {
      const endpoint = {
        parent: `delete-parent-category/${id}`,
        child: `delete-child-category/${id}`,
        variant: `delete-variant/${id}`,
        option: `delete-variation-option/${id}`,
      }[type];

      const res = await fetch(`http://localhost:8383/api/categories/${endpoint}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to delete ${type}`);
      }

      if (type === 'parent' || type === 'child') {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setVariations((prev) => prev.filter((v) => v.categoryId !== id));
      } else if (type === 'variant') {
        setVariations((prev) => prev.filter((v) => v.id !== id));
      } else if (type === 'option') {
        setVariations((prev) =>
          prev.map((v) => ({
            ...v,
            options: v.options.filter((o) => o.id !== id),
          }))
        );
      }
    } catch (error: any) {
      console.error(`Failed to delete ${type}`, error);
      setSubmissionError(error.message || `Failed to delete ${type}`);
    }
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
            <div className="flex gap-2">
              <button
                onClick={() => openModal('edit-parent', undefined, { id: parent.id, name: parent.name })}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete('parent', parent.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => openModal('child', parent.id)}
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                + Add Child
              </button>
            </div>
          </div>

          {childCategories(parent.id).map((child) => (
            <div key={child.id} className="ml-4 mt-2 bg-white p-3 rounded">
              <div className="flex justify-between items-center">
                <h3>{child.name || 'Unnamed Child Category'}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal('edit-child', parent.id, { id: child.id, name: child.name })}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete('child', child.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => openModal('variant', child.id)}
                    className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600"
                  >
                    + Add Variant
                  </button>
                  <button
                    onClick={() => openModal('option', child.id)}
                    className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                  >
                    + Add Options
                  </button>
                </div>
              </div>
              <ul className="mt-2 text-sm ml-4 list-disc">
                {getVariations(child.id).map((v) => (
                  <li key={v.id} className="flex justify-between items-center">
                    <span>
                      {v.name}: {v.options.map((o) => o.value).join(', ')}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('edit-variant', child.id, { id: v.id, name: v.name })}
                        className="bg-yellow-500 text-white px-1 py-0.5 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('variant', v.id)}
                        className="bg-red-500 text-white px-1 py-0.5 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
                {getVariations(child.id).flatMap((v) =>
                  v.options.map((o) => (
                    <li key={o.id} className="flex justify-between items-center ml-4">
                      <span>Option: {o.value}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            openModal('edit-option', child.id, { id: o.id, value: o.value })
                          }
                          className="bg-yellow-500 text-white px-1 py-0.5 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete('option', o.id)}
                          className="bg-red-500 text-white px-1 py-0.5 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
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
                : modalType === 'variant'
                ? 'Add Variants'
                : modalType === 'option'
                ? 'Add Variation Options'
                : modalType === 'edit-parent'
                ? 'Edit Parent Category'
                : modalType === 'edit-child'
                ? 'Edit Child Category'
                : modalType === 'edit-variant'
                ? 'Edit Variant'
                : 'Edit Variation Option'}
            </h2>

            {submissionError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {submissionError}
              </div>
            )}

            {['parent', 'edit-parent'].includes(modalType!) && (
              <input
                type="text"
                placeholder="Parent category name"
                className="border p-2 rounded w-full mb-4"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
              />
            )}

            {['child', 'edit-child'].includes(modalType!) && (
              <input
                type="text"
                placeholder="Child category name"
                className="border p-2 rounded w-full mb-4"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
              />
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

            {modalType === 'edit-variant' && (
              <input
                type="text"
                placeholder="Variant name (e.g., Size)"
                className="border p-2 rounded w-full mb-4"
                value={variantList[0].name}
                onChange={(e) => {
                  const updated = [...variantList];
                  updated[0].name = e.target.value;
                  setVariantList(updated);
                }}
              />
            )}

            {modalType === 'option' && (
              <>
                <select
                  value={selectedVariationId}
                  onChange={(e) => setSelectedVariationId(e.target.value)}
                  className="border p-2 rounded w-full mb-4"
                >
                  <option value="">Select a variation</option>
                  {getVariations(currentParentId!).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
                {newOptions.map((opt, index) => (
                  <input
                    key={opt.id}
                    type="text"
                    placeholder={`New option ${index + 1}`}
                    className="border p-2 rounded w-full mb-1"
                    value={opt.value}
                    onChange={(e) => handleNewOptionChange(index, e.target.value)}
                  />
                ))}
                <button
                  onClick={handleAddNewOptionInput}
                  className="text-blue-600 text-sm mt-1 hover:underline"
                >
                  + Add Another Option
                </button>
              </>
            )}

            {modalType === 'edit-option' && (
              <input
                type="text"
                placeholder="Option value"
                className="border p-2 rounded w-full mb-4"
                value={newOptions[0].value}
                onChange={(e) => handleNewOptionChange(0, e.target.value)}
              />
            )}

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