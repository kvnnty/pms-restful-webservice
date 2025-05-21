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
  count: z.number({ invalid_type_error: "Count must be a number" }).int().positive("Count must be at least 1"),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "TRUCK"]),
});

type FormData = z.infer<typeof formSchema>;

export default function AddBulkParkingSpots({ parkingId, onClose }: { parkingId: string; onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      count: 1,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosClient.post("/parking/slots/bulk", {
        ...data,
        parkingId,
      });
      reset();
      toast.success(response.data.message);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message || "Failed to add parking slots.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-full">
          <label className="block font-medium">Number of parking spots</label>
          <Input type="number" {...register("count", { valueAsNumber: true })} className="mt-2" />
          {errors.count && <p className="text-red-500">{errors.count.message}</p>}
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
          {isSubmitting ? "Adding..." : "Add Parking Slots"}
          <ArrowRight />
        </Button>
      </div>
    </form>
  );
}
