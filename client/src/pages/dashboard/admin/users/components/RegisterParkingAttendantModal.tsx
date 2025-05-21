import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterParkingAttendantModal({ refresh, onClose }: { refresh: () => void; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    setLoading(true);
    const userData = { ...data };
    toast
      .promise(axiosClient.post("/users/parking-lot-attendants/register", userData), {
        loading: "Creating new parking lot attendant...",
        success: (response) => {
          refresh();
          onClose();
          return response?.data?.message || "Parking lot attendant created";
        },
        error: (err) => err.response?.data?.message || err.message || "Registration failed. Please try again later.",
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="w-full flex gap-3">
          <div className="w-full space-y-1">
            <label className="block text-sm font-semibold mb-2">First Name</label>
            <Input type="text" placeholder="Enter first name" {...register("firstName")} />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          <div className="w-full space-y-1">
            <label className="block text-sm font-semibold mb-2">Last Name</label>
            <Input type="text" placeholder="Enter last name" {...register("lastName")} />
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold mb-2">Parking lot attendant's Email</label>
          <Input type="email" placeholder="Enter email" {...register("email")} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold mb-2">
            Parking lot attendant's Password <span className="text-xs font-normal text-gray-500">(They will use this to log in)</span>
          </label>
          <Input type="password" placeholder="Enter password" {...register("password")} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer flex justify-center items-center px-2 h-12 bg-blue-500 text-white rounded-xl disabled:opacity-80">
          {loading ? <Spinner /> : "Continue"}
        </button>
      </form>
    </div>
  );
}
