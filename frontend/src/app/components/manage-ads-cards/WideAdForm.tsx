'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import WideAd from "./WideAd";
import { supabase } from "@/lib/supabase";

const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length === 1,
      "An image file is required"
    ),
});

type ImageFormData = z.infer<typeof imageSchema>;

export default function WideAdForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = async (data: ImageFormData) => {
    const imageFile = data.image[0];
    console.log("Uploading image:", imageFile);
    // upload to supabase
    const { data: uploadData, error } = await supabase.storage.from('ads').upload(`${imageFile.name}`, imageFile);
    if (error) {
      console.error("Error uploading image:", error);
      return;
    }

    const response = await fetch("http://localhost:8383/ads/create-ad", {
      method: "POST",
      body: JSON.stringify({ image_url: imageFile , type: "wide"}),
    });
    const responseData = await response.json();
    console.log("data", responseData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Wide Ad Image</h1>
    
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
            <p className="text-red-500 text-sm mt-2">{String(errors.image.message)}</p>
          )}
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
          <div className="w-full">
            <WideAd
              imageUrl={imagePreview}
            />
          </div>
        </div>
      )}
    </div>
  );
} 