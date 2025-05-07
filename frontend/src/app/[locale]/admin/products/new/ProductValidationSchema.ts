import { z } from "zod";

// Schema
export const itemSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .min(0, 'Price must be a positive number'),
  stock_quantity: z
    .number({ invalid_type_error: 'Stock quantity is required' })
    .int('Must be an integer')
    .min(0, 'Stock must be 0 or more')
    .optional(),
  category_id: z.string().uuid('Category is required'),
  brand: z.string().min(2, 'Brand is required'),
  sku: z.string().min(2, 'SKU is required'),
  is_active: z.boolean(),
  images: z.array(z.string()).optional(), // Made optional to avoid validation issues
  parentCategory: z.string().uuid('Parent category is required'),
  childCategory: z.string().uuid().optional(),
  variationOptionIds: z.array(z.string().uuid()).optional(),
  variantStocks: z
    .array(
      z.object({
        optionCombination: z.array(z.string().uuid()),
        stock: z.number().int().min(0, 'Stock must be 0 or more'),
      })
    )
    .optional(),
});