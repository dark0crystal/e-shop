'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud } from "lucide-react";
import WideAd from "./WideAd";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';

const imageSchema = z.object({
  image: z.any(),
});

type ImageFormData = z.infer<typeof imageSchema>;

export default function WideAdForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: zodResolver(imageSchema),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageError(null);
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      setImageError('Image size must be less than 5MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are allowed');
      return;
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `ad-${uuidv4()}.${fileExtension}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('ads')
      .upload(fileName, file, {
        contentType: file.type,
      });

    if (uploadError) {
      setImageError(`Failed to upload image: ${uploadError.message}`);
      return;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('ads')
      .getPublicUrl(fileName);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      setImageError('Failed to generate public URL for image');
      return;
    }

    setImageUrl(publicUrlData.publicUrl);
    setImagePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: ImageFormData) => {
    if (!imageUrl) {
      setImageError('Please upload an image first');
      return;
    }

    try {
      const response = await fetch("http://localhost:8383/api/ads/create-ad", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image_url: imageUrl,
          type: "wide"
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ad');
      }

      const responseData = await response.json();
      console.log("Ad created:", responseData);
      
      // Reset form
      setImagePreview(null);
      setImageUrl(null);
    } catch (error: any) {
      setImageError(error.message || 'Failed to create ad');
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
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {imageError && (
            <p className="text-red-500 text-sm mt-2">{imageError}</p>
          )}
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
          <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden shadow-md">
            <img
              src={imagePreview}
              alt="Wide Ad Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}