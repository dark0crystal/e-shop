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
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
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
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    email: '',
    otp: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'details' | 'otp'>('details');

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

    if (step === 'details') {
      if (!formData.firstName || !formData.lastName || !formData.addressLine || !formData.city || !formData.region || !formData.postalCode || !formData.country) {
        setError('All shipping details are required.');
        return;
      }

      if (formData.paymentMethod === 'credit_card' && (!formData.cardNumber || !formData.expiryDate || !formData.cvv)) {
        setError('All payment details are required for credit card.');
        return;
      }

      if (!formData.email) {
        setError('Email is required for authentication.');
        return;
      }

      await handleSendOtp();
      return;
    }

    try {
      const cartCookie = Cookies.get('cart') || '[]';
      const cartItems = JSON.parse(cartCookie);

      const response = await fetch('http://localhost:8383/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          cartItems,
        }),
      });

      if (!response.ok) throw new Error('Failed to verify OTP');

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      Cookies.remove('cart');

      const orderResponse = await fetch('http://localhost:8383/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          cartItems,
          shippingMethodId: 'shipping-method-id',
          paymentMethodId: 'payment-method-id',
          address: {
            unitNumber: '',
            streetNumber: '',
            addressLine: formData.addressLine,
            city: formData.city,
            region: formData.region,
            countryId: formData.country,
          },
        }),
      });

      if (!orderResponse.ok) throw new Error('Failed to process checkout');
      router.push('/order-confirmation');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {step === 'details' ? 'Shipping & Payment Details' : 'Verify OTP'}
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
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            {formData.paymentMethod === 'credit_card' && (
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="Card Number"
                  className="border p-2 rounded w-full"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="CVV"
                    className="border p-2 rounded"
                  />
                </div>
              </div>
            )}
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {step === 'details' ? 'Continue to OTP' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
}