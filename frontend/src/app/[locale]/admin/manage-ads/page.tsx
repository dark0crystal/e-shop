"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadCloud, ImageIcon, LayoutIcon, InfoIcon, ArrowDownIcon } from "lucide-react"; // Icon
import WideAd from "@/app/components/manage-ads-cards/WideAd";
import WideAdForm from "@/app/components/manage-ads-cards/WideAdForm";
import SmallAdForm from "@/app/components/manage-ads-cards/SmallAdForm";

const imageSchema = z.object({
  image: z
    .any()
    .refine(
      (file) => file instanceof FileList && file.length === 1,
      "An image file is required"
    ),
});

type ImageFormData = z.infer<typeof imageSchema>;

export default function ManageAdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Advertisements</h1>
      
      <div className="space-y-16">
        <WideAdForm />

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-center mb-4">
            <InfoIcon className="text-blue-500 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-blue-700">Advertisement Giude</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <LayoutIcon className="text-orange-500 mr-2" size={18} />
                <h4 className="font-medium">Wide Advertisements</h4>
              </div>
              <p className="text-sm text-gray-600">Full-width banners ideal for prominent placement at the top of pages.</p>
            </div>
            
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex items-center mb-2">
                <ImageIcon className="text-green-500 mr-2" size={18} />
                <h4 className="font-medium">Small Advertisements</h4>
              </div>
              <p className="text-sm text-gray-600">Compact ads that grab attention. Use high-quality, visually appealing images to increase engagement and click-through rates.</p>
            </div>
          </div>
          
         
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm text-gray-500">OR</span>
          </div>
        </div>
        
       
        
        <SmallAdForm />
      </div>
    </div>
  );
}
