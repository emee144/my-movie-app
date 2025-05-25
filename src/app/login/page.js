"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email").min(5, "Email is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginPage = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (formData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // Send cookies
      });

      if (!res.ok) {
        let errorMessage = "Login failed";
        try {
          const data = await res.json();
          errorMessage = data.error || errorMessage;
        } catch {
          console.error("Failed to parse error response");
        }
        throw new Error(errorMessage);
      }

      console.log("Login successful");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center">Login</h2>

      {/* Email & Password Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">
            Email
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 border rounded"
              autoComplete="email"
            />
          </label>
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Password
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 border rounded"
              autoComplete="current-password"
            />
          </label>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;