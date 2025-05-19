"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/config/axios.config";
import type { Parking } from "@/types/parking";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z
  .object({
    name: z.string().optional(),
    address: z.string().optional(),
    capacity: z.number({ invalid_type_error: "Capacity must be a number" }).int().positive("Capacity must be a positive number").optional(),
    pricePerHour: z.number({ invalid_type_error: "Price per hour must be a number" }).int().positive("Price per hour must be a positive number").optional(),
  })
  .refine((data) => data.name || data.address || data.capacity || data.pricePerHour, {
    message: "At least one field must be filled out",
    path: ["form"],
  });

type FormData = z.infer<typeof formSchema>;

export default function UpdateParkingDetails({ parking, onClose }: { parking: Parking; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      address: parking.address,
      name: parking.name,
      capacity: parking.capacity,
      pricePerHour: parking.pricePerHour,
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      await axiosClient.put(`/parking/${parking}`, data);
      toast.success("Parking details updated");
      reset();
      onClose();
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update parking details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Name</label>
        <Input type="text" {...register("name")} className="mt-2" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Address</label>
        <Input type="text" {...register("address")} className="mt-2" />
        {errors.address && <p className="text-red-500">{errors.address.message}</p>}
      </div>

      <div className="flex gap-2">
        <div className="w-full">
          <label className="block font-medium">Capacity</label>
          <Input type="number" {...register("capacity", { valueAsNumber: true })} className="mt-2" />
          {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
        </div>

        <div className="w-full">
          <label className="block font-medium">Price per Hour (RWF)</label>
          <Input type="number" {...register("pricePerHour", { valueAsNumber: true })} className="mt-2" />
          {errors.pricePerHour && <p className="text-red-500">{errors.pricePerHour.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Parking details"}
          <ArrowRightIcon />
        </Button>
      </div>
    </form>
  );
}
