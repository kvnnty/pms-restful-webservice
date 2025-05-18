"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { type RegisterForm, registerSchema } from "./validation";
import { Car } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    const userData = { ...data };

    toast
      .promise(axiosClient.post("/auth/register", userData), {
        loading: "Creating account...",
        success: (response) => {
          navigate("/dashboard");
          return response?.data?.message || "Account created!";
        },
        error: (err) => err.response?.data?.message || err.message || "Registration failed. Please try again later.",
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative z-[20] mx-auto w-full max-w-3xl flex flex-col">
      <div className="pb-5 w-full flex flex-col items-center space-y-2">
        <Car size={40} color="#3b82f6" />
        <h1 className="font-bold text-xl text-blue-500">PMS Portal</h1>
      </div>
      <div className="bg-white p-10 rounded-3xl border border-gray-100 w-full flex flex-col space-y-5">
        <h2 className="text-3xl font-bold text-center mb-4">Create account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="w-full flex gap-3">
            <div className="w-full space-y-1">
              <label className="block text-sm font-semibold mb-2">First Name</label>
              <Input type="text" placeholder="Enter your first name" {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>

            <div className="w-full space-y-1">
              <label className="block text-sm font-semibold mb-2">Last Name</label>
              <Input type="text" placeholder="Enter your last name" {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <Input type="email" placeholder="Enter your email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold mb-2">Password</label>
            <Input type="password" placeholder="Enter your password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" onCheckedChange={(value: boolean) => setValue("terms", value, { shouldValidate: true })} />
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Accept terms and conditions
              </label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer flex justify-center items-center px-2 h-14 bg-blue-500 text-white rounded-xl disabled:opacity-80">
            {loading ? <Spinner /> : "Continue"}
          </button>
        </form>
      </div>
      <p className="text-center mt-5">
        Already have an account{" "}
        <Link to="/auth/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
