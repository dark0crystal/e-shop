'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const checkoutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    console.log('Form Data:', data);
    // Add your submission logic here (e.g., API call)
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Checkout</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              {...register('name')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your phone number"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>

          {/* Country */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input
              {...register('country')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your country"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
          </div>

          {/* City */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              {...register('city')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your city"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>

          {/* Address */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              {...register('address')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
              placeholder="Enter your full address"
              rows={3}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          {/* Payment Method */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              {...register('paymentMethod')}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            >
              <option value="">Select a payment method</option>
              <option value="card">Debit/Credit Card</option>
              <option value="cod">Cash on Delivery</option>
            </select>
            {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
}