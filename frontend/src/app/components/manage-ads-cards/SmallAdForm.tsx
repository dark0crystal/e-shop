'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import SmallAd from "./SmallAd";

const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length === 1,
      "An image file is required"
    ),
  brand: z.string().optional(),
  title: z.string().optional(),
  link: z.string().url().optional(),
});

type ImageFormData = z.infer<typeof imageSchema>;

export default function SmallAdForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = (data: ImageFormData) => {
    const imageFile = data.image[0];
    console.log("Uploading image:", imageFile);
    // Handle image upload (e.g., to Supabase)
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Small Ad Image</h1>
    
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex items-center flex-col">
        <div className="w-full max-w-md">
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <UploadCloud className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-gray-500 text-sm">Click to upload or drag and drop</p>
            <input
              id="image"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image.message}</p>
          )}
        </div>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
              Brand (Optional)
            </label>
            <input
              type="text"
              id="brand"
              {...register("brand")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              {...register("title")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700">
              Link (Optional)
            </label>
            <input
              type="url"
              id="link"
              {...register("link")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full max-w-md bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Upload Image
        </button>
      </form>

      {imagePreview && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Preview</h2>
          <div className="w-full max-w-md">
            <SmallAd
              imageUrl={imagePreview}
              brand="Example Brand"
              title="Ad Title Preview"
              link="https://example.com"
            />
          </div>
        </div>
      )}
    </div>
  );
} 