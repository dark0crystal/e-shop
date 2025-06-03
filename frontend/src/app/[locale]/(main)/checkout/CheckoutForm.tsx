'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface FormData {
  firstName: string;
  lastName: string;
  addressLine: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  mobileNumber: string;
}

export default function CheckOutForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    addressLine: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    mobileNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.addressLine || 
          !formData.city || !formData.region || !formData.postalCode || !formData.country ||
          !formData.mobileNumber) {
        setError('All fields are required.');
        return;
      }

      const token = localStorage.getItem('token');
      const cartCookie = Cookies.get('cart') || '[]';
      const cartItems = JSON.parse(cartCookie);

      // First create a payment method
      const paymentMethodResponse = await fetch('http://localhost:8383/api/payment/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          paymentTypeId: 'card', // This should match an existing payment type in your database
          provider: 'Thawani',
          accountNumber: 1234567890, // This should be a real account number in production
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        }),
      });

      if (!paymentMethodResponse.ok) {
        throw new Error('Failed to create payment method');
      }

      const { id: paymentMethodId } = await paymentMethodResponse.json();

      // Create checkout session with the new payment method ID
      const checkoutResponse = await fetch('http://localhost:8383/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          cartItems,
          shippingAddress: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            addressLine: formData.addressLine,
            city: formData.city,
            region: formData.region,
            postalCode: formData.postalCode,
            country: formData.country,
            mobileNumber: formData.mobileNumber,
          },
          paymentMethodId,
        }),
      });
      const data = await checkoutResponse.json();
      const session_id = data.session_id;
      console.log("session_id", session_id);
  
      const checkoutUrl = `https://uatcheckout.thawani.om/pay/${session_id}?key=${process.env.NEXT_PUBLIC_THAWANI_PUBLISHABLE_KEY}`
      
      console.log("checkoutUrl", checkoutUrl);
      if (!checkoutResponse.ok) throw new Error('Failed to create checkout session');

      // Redirect to Thawani checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Mobile Number"
          className="border p-2 rounded w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
        </div>
        <input
          type="text"
          name="addressLine"
          value={formData.addressLine}
          onChange={handleChange}
          placeholder="Address Line"
          className="border p-2 rounded w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="Region/State"
            className="border p-2 rounded"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className="border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'Processing...' : 'Complete Purchase'}
        </button>
      </form>
    </div>
  );
}