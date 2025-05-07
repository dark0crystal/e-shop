"use client"
import { useForm ,SubmitHandler } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
    name: z.string(),
    description:z.string().min(10),
});
type FormFields = z.infer<typeof schema>;

export default function AddNewProduct(){
    /**
     * Register field :
     * One of the key concepts in React Hook Form is to register your component into the hook.
     *This will make its value available for both the form validation and submission.
     * 
     * 
     */
    const {register , handleSubmit } = useForm<FormFields>({resolver:zodResolver(schema)});

    const onSubmit:SubmitHandler<FormFields>=(data)=>{
        console.log(data)
    }

    return(
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                 <input
                   type="text"
                   {...register('name')}
                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="Product name"
                 />
                 {/* {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>} */}
              </div>

            <button
            type="submit"
            >
                submit
            </button>
            </form>
        </div>

    )
}



// 'use client';

// import { useForm, SubmitHandler } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useState } from 'react';
// import Image from 'next/image';

// // Schema
// const itemSchema = z.object({
//   name: z.string().min(2, 'Name is required'),
//   description: z.string().min(10, 'Description must be at least 10 characters'),
//   price: z
//     .number({ invalid_type_error: 'Price is required' })
//     .min(0, 'Price must be a positive number'),
//   stock_quantity: z
//     .number({ invalid_type_error: 'Stock quantity is required' })
//     .int('Must be an integer')
//     .min(0, 'Stock must be 0 or more')
//     .optional(),
//   category_id: z.string().uuid('Category is required'),
//   brand: z.string().min(2, 'Brand is required'),
//   sku: z.string().min(2, 'SKU is required'),
//   is_active: z.boolean(),
//   images: z.array(z.string()).min(1, 'At least one image is required').optional(),
//   parentCategory: z.string().uuid('Parent category is required'),
//   childCategory: z.string().uuid().optional(),
//   variationOptionIds: z.array(z.string().uuid()).optional(),
//   variantStocks: z
//     .array(
//       z.object({
//         optionCombination: z.array(z.string().uuid()),
//         stock: z.number().int().min(0, 'Stock must be 0 or more'),
//       })
//     )
//     .optional(),
// });

// type ItemFormFields = z.infer<typeof itemSchema>;

// const variations = [
//   {
//     id: 'v1',
//     categoryId: '44444444-4444-4444-4444-444444444444',
//     name: 'Size',
//     options: [
//       { id: 'o1', value: 'S' },
//       { id: 'o2', value: 'M' },
//       { id: 'o3', value: 'L' },
//     ],
//   },
// ];

// const categories = [
//   { id: '11111111-1111-1111-1111-111111111111', name: 'Electronics', parentId: '' },
//   { id: '22222222-2222-2222-2222-222222222222', name: 'Clothing', parentId: '' },
//   { id: '33333333-3333-3333-3333-333333333333', name: 'Home & Kitchen', parentId: '' },
//   { id: '44444444-4444-4444-4444-444444444444', name: 'T-Shirt', parentId: '22222222-2222-2222-2222-222222222222' },
//   { id: '55555555-5555-5555-5555-555555555555', name: 'Shoes', parentId: '22222222-2222-2222-2222-222222222222' },
// ];

// export default function NewProduct() {
//   const [previewImages, setPreviewImages] = useState<string[]>([]);
//   const [imageError, setImageError] = useState<string | null>(null);
//   const [variantStocks, setVariantStocks] = useState<
//     { optionCombination: string[]; stock: number }[]
//   >([]);
//   const [submittedData, setSubmittedData] = useState<any>(null);
//   const [submissionError, setSubmissionError] = useState<string | null>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     setValue,
//     watch,
//     trigger,
//   } = useForm<ItemFormFields>({
//     // resolver: zodResolver(itemSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       is_active: true,
//       images: [],
//       variationOptionIds: [],
//       name: '',
//       description: '',
//       price: 0,
//       category_id: '',
//       brand: '',
//       sku: '',
//       parentCategory: '',
//     },
//   });

//   const selectedParentId = watch('parentCategory');
//   const parentCategories = categories.filter((cat) => !cat.parentId);
//   const childCategories = categories.filter((cat) => cat.parentId === selectedParentId);
//   const selectedCategoryId = watch('childCategory') || selectedParentId;
//   const applicableVariations = variations.filter(v => v.categoryId === selectedCategoryId);
//   const hasVariations = applicableVariations.length > 0;

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;

//     setImageError(null);
//     const maxSize = 5 * 1024 * 1024; // 5MB
//     const newImages: string[] = [];
//     const newPreviewImages: string[] = [];

//     Array.from(files).forEach((file) => {
//       if (file.size > maxSize) {
//         setImageError('Image size must be less than 5MB');
//         return;
//       }
//       if (!file.type.startsWith('image/')) {
//         setImageError('Only image files are allowed');
//         return;
//       }

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const result = reader.result as string;
//         newImages.push(result);
//         newPreviewImages.push(result);
//         if (newImages.length === files.length) {
//           setValue('images', [...(watch('images') || []), ...newImages]);
//           setPreviewImages([...previewImages, ...newPreviewImages]);
//           trigger('images');
//         }
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const removeImage = (index: number) => {
//     const updatedImages = [...previewImages];
//     updatedImages.splice(index, 1);
//     setPreviewImages(updatedImages);
//     setValue('images', updatedImages);
//     trigger('images');
//   };

//   const onSubmit: SubmitHandler<ItemFormFields> = async (data) => {
//     setSubmissionError(null);
//     try {
//       const categoryId = data.childCategory || data.parentCategory;
      
//       // Validate category_id
//       if (!categoryId) {
//         throw new Error('Category selection is required');
//       }

//       const payload = {
//         ...data,
//         category_id: categoryId,
//         variationOptionIds: data.variationOptionIds?.filter(id => id) || [],
//         variantStocks: hasVariations ? variantStocks : undefined,
//         stock_quantity: hasVariations ? undefined : data.stock_quantity,
//       };

//       // For demo purposes, we'll simulate a successful API call
//       // In a real application, replace this with your actual API endpoint
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

//       // Store the submitted data
//       setSubmittedData(payload);
//       reset();
//       setPreviewImages([]);
//       setVariantStocks([]);
//     } catch (error: any) {
//       console.error('Error submitting product:', error);
//       setSubmissionError(error.message || 'Failed to submit product. Please try again.');
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="bg-white rounded-xl shadow-md p-6">
//         <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
//         {submissionError && (
//           <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
//             {submissionError}
//           </div>
//         )}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                 <input
//                   type="text"
//                   {...register('name')}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Product name"
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea
//                   {...register('description')}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   rows={4}
//                   placeholder="Product description"
//                 />
//                 {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
//                 <select
//                   {...register('parentCategory')}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   <option value="">Select parent category</option>
//                   {parentCategories.map((category) => (
//                     <option key={category.id} value={category.id}>
//                       {category.name}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.parentCategory && <p className="text-red-500 text-sm mt-1">{errors.parentCategory.message}</p>}
//               </div>

//               {selectedParentId && childCategories.length > 0 && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
//                   <select
//                     {...register('childCategory')}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select subcategory</option>
//                     {childCategories.map((category) => (
//                       <option key={category.id} value={category.id}>
//                         {category.name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.childCategory && <p className="text-red-500 text-sm mt-1">{errors.childCategory.message}</p>}
//                 </div>
//               )}
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   {...register('price', { valueAsNumber: true })}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="0.00"
//                 />
//                 {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
//               </div>

//               {!hasVariations && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
//                   <input
//                     type="number"
//                     {...register('stock_quantity', { valueAsNumber: true })}
//                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     placeholder="0"
//                   />
//                   {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity.message}</p>}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
//                 <input
//                   type="text"
//                   {...register('brand')}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Product brand"
//                 />
//                 {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
//                 <input
//                   type="text"
//                   {...register('sku')}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Stock Keeping Unit"
//                 />
//                 {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>}
//               </div>

//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   {...register('is_active')}
//                   id="is_active"
//                   className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                 />
//                 <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
//               </div>
//             </div>
//           </div>

//           {hasVariations && (
//             <div className="space-y-4">
//               <h2 className="text-lg font-semibold">Stock for Variant Combinations</h2>
//               {generateCombinations(applicableVariations.map(v => v.options.map(o => o.id))).map((combination, idx) => {
//                 const label = combination.map(id => {
//                   const option = variations.flatMap(v => v.options).find(o => o.id === id);
//                   return option?.value || '';
//                 }).join(' / ');

//                 return (
//                   <div key={idx} className="flex items-center gap-4">
//                     <span className="min-w-[200px]">{label}</span>
//                     <input
//                       type="number"
//                       className="border border-gray-300 px-3 py-1 rounded w-32"
//                       placeholder="Stock"
//                       min={0}
//                       value={variantStocks.find(v => JSON.stringify(v.optionCombination) === JSON.stringify(combination))?.stock || ''}
//                       onChange={(e) => {
//                         const newStock = parseInt(e.target.value) || 0;
//                         setVariantStocks((prev) => {
//                           const updated = [...prev];
//                           const index = updated.findIndex(v => JSON.stringify(v.optionCombination) === JSON.stringify(combination));
//                           if (index > -1) {
//                             updated[index].stock = newStock;
//                           } else {
//                             updated.push({ optionCombination: combination, stock: newStock });
//                           }
//                           setValue('variantStocks', updated);
//                           return updated;
//                         });
//                       }}
//                     />
//                   </div>
//                 );
//               })}
//               {errors.variantStocks && <p className="text-red-500 text-sm mt-1">{errors.variantStocks.message}</p>}
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               onChange={handleImageUpload}
//               className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
//             <div className="flex flex-wrap gap-4 mt-4">
//               {previewImages.map((img, idx) => (
//                 <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
//                   <Image src={img} alt={`preview-${idx}`} fill className="object-cover" />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(idx)}
//                     className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 py-1"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>}
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`px-6 py-2 rounded-lg text-white font-semibold ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//             >
//               {isSubmitting ? 'Submitting...' : 'Submit'}
//             </button>
//           </div>
//         </form>

//         {submittedData && (
//           <div className="mt-8 p-4 border rounded-lg bg-gray-50">
//             <h2 className="text-lg font-semibold mb-3">Submitted Data:</h2>
//             <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-sm">
//               {JSON.stringify(submittedData, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function generateCombinations(variationOptions: string[][]): string[][] {
//   if (variationOptions.length === 0) return [[]];
//   const [first, ...rest] = variationOptions;
//   const combinations = generateCombinations(rest);
//   return first.flatMap((v) => combinations.map((c) => [v, ...c]));
// }