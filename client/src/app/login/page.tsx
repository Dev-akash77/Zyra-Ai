"use client";

import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import Link from "next/link";

export default function LoginPage(){
    const {register,handleSubmit,formState:{errors}}=useForm({resolver:zodResolver(loginSchema)})

    const onSubmit = async(data:any)=>{
        try{
            await axios.post("http://localhost:5000/api/auth/login",data)
                alert("Login Successful");
        }catch(e:any){
           alert(e.response?.data?.message || "Something wrong")     
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-blue-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md p-8 shadow-lg rounded-2xl space-y-2 bg-white"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
          Welcome Back!
        </h2>

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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition mt-2"
        >
          Login
        </button>

        {/* Forgot Password */}
<p className="text-center text-sm">
  <Link href="/forgot-password" className="text-red-600 font-medium hover:underline">
    Forgot Password?
  </Link>
</p>

{/* Register Link */}
<p className="text-center text-gray-500 text-sm">
  Don't have an account?{" "}
  <Link href="/register" className="text-blue-800 font-medium hover:underline">
    Register here
  </Link>
</p>
      </form>
    </div>
    )
}