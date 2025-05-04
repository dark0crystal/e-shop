"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits").optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    if (!submitted) {
      console.log(data)
      const res = await fetch("http://localhost:8383/api/auth/send-otp", {
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (res.ok) setSubmitted(true);
      else alert("Failed to send OTP.");
    } else {
      const res = await fetch("http://localhost:8383/api/auth/verify-otp", {
        method: "POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ email: data.email, otp: data.otp }),
      });

      if (res.ok) alert("Logged in!");
      else alert("Invalid or expired OTP.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Login via Email</h1>

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
