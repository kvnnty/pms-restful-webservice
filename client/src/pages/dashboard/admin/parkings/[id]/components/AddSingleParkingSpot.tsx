"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  vehicleSize: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "TRUCK"]),
});

type FormData = z.infer<typeof formSchema>;

export default function AddSingleParkingSpot({ parkingId, onClose }: { parkingId: string; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post("/parking/slots", {
        ...data,
        parkingId,
      });
      reset();
      toast.success(response.data.message || "Parking spot added successfully");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add parking spot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block font-medium">Location</label>
        <Input type="text" {...register("location")} className="mt-2" />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block font-medium">Vehicle Size</label>
          <Select onValueChange={(value) => setValue("vehicleSize", value as any)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Vehicle Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SMALL">Small</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LARGE">Large</SelectItem>
            </SelectContent>
          </Select>
          {errors.vehicleSize && <p className="text-red-500">{errors.vehicleSize.message}</p>}
        </div>

        <div className="w-full">
          <label className="block font-medium">Vehicle Type</label>
          <Select onValueChange={(value) => setValue("vehicleType", value as any)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select Vehicle Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAR">Car</SelectItem>
              <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
              <SelectItem value="TRUCK">Truck</SelectItem>
            </SelectContent>
          </Select>
          {errors.vehicleType && <p className="text-red-500">{errors.vehicleType.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Parking Spot"}
          <ArrowRight />
        </Button>
      </div>
    </form>
  );
}
