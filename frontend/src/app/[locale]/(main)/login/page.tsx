'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    if (!submitted) {
      try {
        const res = await fetch("http://localhost:8383/api/auth/send-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        });

        if (!res.ok) throw new Error("Failed to send OTP.");
        setSubmitted(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while sending OTP");
      }
    } else {
      try {
        // Get cart from cookies to sync with database
        const cartCookie = Cookies.get('cart') || '[]';
        const cartItems = JSON.parse(cartCookie).filter((item: any) => item.productItemId); // Filter out invalid items

        console.log('Cart Items being sent:', cartItems); // Debug log

        const res = await fetch("http://localhost:8383/api/auth/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, otp: data.otp, cartItems }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Invalid or expired OTP.");
        }

        const { token } = await res.json();
        localStorage.setItem('token', token); // Store JWT in localStorage
        Cookies.remove('cart'); // Clear guest cart after sync

        router.push('/checkout'); // Redirect to checkout
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during login");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Login via Email</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {submitted && (
          <div>
            <label className="block mb-1 text-sm font-medium">Enter OTP</label>
            <input
              type="text"
              {...register("otp")}
              maxLength={6}
              className="w-full border border-gray-300 rounded px-3 py-2 text-lg tracking-widest text-center"
              placeholder="123456"
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          {isSubmitting ? "Processing..." : submitted ? "Verify OTP" : "Send OTP"}
        </button>
      </form>
    </div>
  );
}