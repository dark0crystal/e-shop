"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import WideAd from "@/app/components/manage-ads-cards/WideAd";

const adSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  title: z.string().min(1, "Title is required"),
  link: z.string().url("Must be a valid URL"),
  image: z
    .any()
    .refine((file) => file instanceof FileList && file.length === 1, "Image is required"),
});

type AdFormData = z.infer<typeof adSchema>;

export default function ManageAdsForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
  });

  const watchedFields = watch(); // to show preview live

  const onSubmit = (data: AdFormData) => {
    const imageFile = data.image[0];
    console.log("Submitting ad data:", {
      ...data,
      image: imageFile,
    });
    // Submit to your backend or Supabase
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Ad</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input
            type="text"
            {...register("brand")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Brand name"
          />
          {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            {...register("title")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Ad title"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Link</label>
          <input
            type="url"
            {...register("link")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="https://example.com"
          />
          {errors.link && <p className="text-red-500 text-sm mt-1">{errors.link.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={handleImageChange}
            className="w-full"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>

      {/* Live Preview using WideAd */}
      {imagePreview && (
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-2">Preview</h2>
          <WideAd
            imageUrl={imagePreview}
            brand={watchedFields.brand}
            title={watchedFields.title}
            link={watchedFields.link}
          />
        </div>
      )}
    </div>
  );
}
