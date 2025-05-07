'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Image from 'next/image';

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
  category_id: z.string().uuid('Invalid category ID'),
  brand: z.string().min(2, 'Brand is required'),
  sku: z.string().min(2, 'SKU is required'),
  is_active: z.boolean().default(true),
  images: z.array(z.string()).min(1, 'At least one image is required'),
});

type ItemFormFields = z.infer<typeof itemSchema>;

// Mock categories - replace with actual data from your API
const categories = [
  { id: 'b1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1', name: 'Electronics' ,parentId:''},
  { id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Clothing' ,parentId:''},
  { id: 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', name: 'Home & Kitchen' ,parentId:''},
  { id: 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', name: 'T-Shirt' ,parentId:'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'},
  { id: 'd3d3d3d3-d3d3-d3d3-d3d3-d3d3d3d3d3d3', name: 'Shoes' ,parentId:'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'},

];

export default function NewProduct() {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ItemFormFields>({
    resolver: zodResolver(itemSchema),
    mode: 'onBlur',
    defaultValues: {
      is_active: true,
      images: [],
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    const newPreviewImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        newImages.push(result);
        newPreviewImages.push(result);
        if (newImages.length === files.length) {
          setValue('images', newImages);
          setPreviewImages(newPreviewImages);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: ItemFormFields) => {
    console.log('Form submitted:', data);
    reset();
    setPreviewImages([]);
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Product name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register('description')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows={4}
                  placeholder="Product description"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...register('category_id')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input
                  type="text"
                  {...register('brand')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Product brand"
                />
                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  {...register('stock_quantity', { valueAsNumber: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="0"
                />
                {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  {...register('sku')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Product SKU"
                />
                {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" {...register('is_active')} />
                <label className="text-sm">Is Active</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            <div className="flex flex-wrap gap-2">
              {previewImages.map((src, index) => (
                <div key={index} className="relative w-24 h-24 border rounded">
                  <Image src={src} alt="preview" fill className="object-cover rounded" />
                </div>
              ))}
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
