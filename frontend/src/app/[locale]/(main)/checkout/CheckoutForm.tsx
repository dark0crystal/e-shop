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
  email: string;
  otp: string;
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
    email: '',
    otp: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch('http://localhost:8383/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) throw new Error('Failed to send OTP');
      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while sending OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (step === 'details') {
        if (!formData.firstName || !formData.lastName || !formData.addressLine || 
            !formData.city || !formData.region || !formData.postalCode || !formData.country) {
          setError('All shipping details are required.');
          return;
        }

        if (!formData.email) {
          setError('Email is required for authentication.');
          return;
        }

        await handleSendOtp();
        return;
      }

      // Verify OTP and proceed with checkout
      const cartCookie = Cookies.get('cart') || '[]';
      const cartItems = JSON.parse(cartCookie);

      const authResponse = await fetch('http://localhost:8383/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });

      if (!authResponse.ok) throw new Error('Failed to verify OTP');

      const { token, user } = await authResponse.json();
      localStorage.setItem('token', token);

      // Create checkout session
      const checkoutResponse = await fetch('http://localhost:8383/api/checkout/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
          },
          paymentMethodId: 'card_zK5a7sd98wdwe78TbiSUyLUjann6xFx', // Replace with actual payment method ID
        }),
      });

      if (!checkoutResponse.ok) throw new Error('Failed to create checkout session');

      const { checkoutUrl, orderId } = await checkoutResponse.json();

      // Redirect to Thawani checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {step === 'details' ? 'Shipping Details' : 'Verify OTP'}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 'details' ? (
          <>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
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
          </>
        ) : (
          <input
            type="text"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
            className="border p-2 rounded w-full"
          />
        )}
        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'Processing...' : step === 'details' ? 'Continue to OTP' : 'Complete Purchase'}
        </button>
      </form>
    </div>
  );
}