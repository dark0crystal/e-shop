'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Image from 'next/image';

// Schema
const itemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .min(0, 'Price must be a positive number'),
  stock_quantity: z
    .number({ invalid_type_error: 'Stock quantity is required' })
    .int('Must be an integer')
    .min(0, 'Stock must be 0 or more'),
  category_id: z.string().uuid('Category is required'),
  brand: z.string().min(2, 'Brand is required'),
  sku: z.string().min(2, 'SKU is required'),
  is_active: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  parentCategory: z.string().uuid('Parent category is required'),
  childCategory: z.string().uuid().optional(),
  variationOptionIds: z.array(z.string().uuid()).optional(),
});

type ItemFormFields = z.infer<typeof itemSchema>;

const variations = [
  {
    id: 'v1',
    categoryId: '44444444-4444-4444-4444-444444444444',
    name: 'Size',
    options: [
      { id: 'o1', value: 'S' },
      { id: 'o2', value: 'M' },
      { id: 'o3', value: 'L' },
    ],
  },
  {
    id: 'v2',
    categoryId: '44444444-4444-4444-4444-444444444444',
    name: 'Color',
    options: [
      { id: 'o4', value: 'Red' },
      { id: 'o5', value: 'Blue' },
    ],
  },
];

const categories = [
  { id: '11111111-1111-1111-1111-111111111111', name: 'Electronics', parentId: '' },
  { id: '22222222-2222-2222-2222-222222222222', name: 'Clothing', parentId: '' },
  { id: '33333333-3333-3333-3333-333333333333', name: 'Home & Kitchen', parentId: '' },
  { id: '44444444-4444-4444-4444-444444444444', name: 'T-Shirt', parentId: '22222222-2222-2222-2222-222222222222' },
  { id: '55555555-5555-5555-5555-555555555555', name: 'Shoes', parentId: '22222222-2222-2222-2222-222222222222' },
];

export default function NewProduct() {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ItemFormFields>({
    resolver: zodResolver(itemSchema),
    mode: 'onBlur',
    defaultValues: {
      is_active: true,
      images: [],
      variationOptionIds: [],
    },
  });

  const selectedParentId = watch('parentCategory');
  const parentCategories = categories.filter((cat) => !cat.parentId);
  const childCategories = categories.filter((cat) => cat.parentId === selectedParentId);
  const selectedCategoryId = watch('childCategory') || selectedParentId;
  const applicableVariations = variations.filter(v => v.categoryId === selectedCategoryId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setImageError(null);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const newImages: string[] = [];
    const newPreviewImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.size > maxSize) {
        setImageError('Image size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setImageError('Only image files are allowed');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newImages.push(result);
        newPreviewImages.push(result);
        if (newImages.length === files.length) {
          setValue('images', [...(watch('images') || []), ...newImages]);
          setPreviewImages([...previewImages, ...newPreviewImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updatedImages = [...previewImages];
    updatedImages.splice(index, 1);
    setPreviewImages(updatedImages);
    setValue('images', updatedImages);
  };

  const onSubmit = async (data: ItemFormFields) => {
    try {
      const payload = {
        ...data,
        category_id: data.childCategory || data.parentCategory,
        variationOptionIds: data.variationOptionIds?.filter(id => id) || [],
      };
      console.log('Final payload:', payload);
      reset();
      setPreviewImages([]);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Product description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  {...register('parentCategory')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select parent category</option>
                  {parentCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.parentCategory && <p className="text-red-500 text-sm mt-1">{errors.parentCategory.message}</p>}
              </div>

              {selectedParentId && childCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select
                    {...register('childCategory')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select subcategory</option>
                    {childCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.childCategory && <p className="text-red-500 text-sm mt-1">{errors.childCategory.message}</p>}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  {...register('stock_quantity', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  {...register('brand')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product brand"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  {...register('sku')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product SKU"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Is Active</label>
              </div>
            </div>
          </div>

          {applicableVariations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Variations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicableVariations.map((variation) => (
                  <div key={variation.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {variation.name}
                    </label>
                    <select
                      {...register(`variationOptionIds.${variation.id}`)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select {variation.name.toLowerCase()}</option>
                      {variation.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
            <div className="flex flex-wrap gap-4 mt-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative w-24 h-24 border rounded overflow-hidden">
                  <Image src={src} alt={`preview-${index}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}