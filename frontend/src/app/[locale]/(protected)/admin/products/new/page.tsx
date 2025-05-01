'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
});

type ItemFormFields = z.infer<typeof itemSchema>;

export default function NewProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ItemFormFields>({
    resolver: zodResolver(itemSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ItemFormFields) => {
    console.log('Form submitted:', data);
    reset();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Create New Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register('description')}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Stock Quantity</label>
          <input
            type="number"
            {...register('stock_quantity', { valueAsNumber: true })}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.stock_quantity && (
            <p className="text-red-500 text-sm">{errors.stock_quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Category ID</label>
          <input
            type="text"
            {...register('category_id')}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Brand</label>
          <input
            type="text"
            {...register('brand')}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block font-medium">SKU</label>
          <input
            type="text"
            {...register('sku')}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.sku && <p className="text-red-500 text-sm">{errors.sku.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register('is_active')} className="accent-blue-600" />
          <label className="font-medium">Active</label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
