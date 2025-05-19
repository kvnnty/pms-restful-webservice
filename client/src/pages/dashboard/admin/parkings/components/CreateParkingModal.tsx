"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ required_error: "Parking name is required", invalid_type_error: "Parking name must be a string" })
    .min(1, { message: "Please enter parking name" }),
  address: z
    .string({ required_error: "Parking address is required", invalid_type_error: "Parking address must be a string" })
    .min(1, { message: "Please enter parking address" }),
  pricePerHour: z.number({ required_error: "Parking price per hour rate is required" }).positive(),
  capacity: z.number({ required_error: "Parking capacity is required" }).int().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateParkingModal() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      capacity: undefined,
      pricePerHour: undefined,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/parking", data);
      toast.success(response.data.message);
      navigate(`/dashboard/admin/parkings/${response.data.data.id}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Parking name</label>
          <Input className="mt-2" placeholder="Parking name" {...register("name")} />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label>Address</label>
          <Input className="mt-2" placeholder="Parking address" {...register("address")} />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>
        <div>
          <label>Price per hour</label>
          <Input type="number" className="mt-2" placeholder="Price per hour" {...register("pricePerHour", { valueAsNumber: true })} />
          {errors.pricePerHour && <p className="text-sm text-red-500">{errors.pricePerHour.message}</p>}
        </div>
        <div>
          <label>Capacity</label>
          <Input type="number" className="mt-2" placeholder="Capacity" {...register("capacity", { valueAsNumber: true })} />
          {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="!mt-5 uppercase min-w-[200px]">
            {loading && <Spinner />} Create parking <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
