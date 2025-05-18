'use client'
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
    <div className="p-4 max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            {...register('name')}
            className="border p-2 w-full rounded"
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            {...register('email')}
            className="border p-2 w-full rounded"
            placeholder="Enter your email"
            type="email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            {...register('phone')}
            className="border p-2 w-full rounded"
            placeholder="Enter your phone number"
            type="tel"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            {...register('country')}
            className="border p-2 w-full rounded"
            placeholder="Enter your country"
          />
          {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            {...register('city')}
            className="border p-2 w-full rounded"
            placeholder="Enter your city"
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium">Address</label>
          <textarea
            {...register('address')}
            className="border p-2 w-full rounded"
            placeholder="Enter your full address"
            rows={3}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium">Payment Method</label>
          <select
            {...register('paymentMethod')}
            className="border p-2 w-full rounded"
          >
            <option value="">Select a payment method</option>
            <option value="card">Debit/Credit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-teal-500 text-white p-2 rounded w-full hover:bg-teal-600"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}