"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validation";
import axios from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", data);
      alert("Registration successful");
    } catch (error: any) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 shadow-lg rounded-2xl space-y-2 bg-white"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Create Account
        </h2>

        {/* Name */}
        <label className="text-sm font-medium text-gray-600">Full Name</label>
        <input
          {...register("name")}
          placeholder="John Doe"
          className="p-3 text-black border w-full border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-red-500 text-sm">{errors.name?.message as string}</p>

        {/* Email */}
        <label className="text-sm font-medium text-gray-600">Email</label>
        <input
          {...register("email")}
          placeholder="john@example.com"
          className="p-3 text-black border w-full border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-red-500 text-sm">{errors.email?.message as string}</p>

        {/* Password */}
        <label className="text-sm font-medium text-gray-600">Password</label>
        <input
          type="password"
          {...register("password")}
          placeholder="••••••••"
          className="p-3 text-black border w-full border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-red-500 text-sm">{errors.password?.message as string}</p>

        {/* Confirm Password */}
        <label className="text-sm font-medium text-gray-600">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="••••••••"
          className="p-3 text-black border w-full border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
        />
        <p className="text-red-500 text-sm">
          {errors.confirmPassword?.message as string}
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition mt-2"
        >
          Register
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-500 text-sm pt-2">
          Already registered?{" "}
          <Link href="/login" className="text-blue-800 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}