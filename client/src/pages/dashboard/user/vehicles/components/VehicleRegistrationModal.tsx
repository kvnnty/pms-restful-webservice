"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  plateNumber: z.string().min(3, "Plate number is required"),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "TRUCK"], {
    errorMap: () => ({ message: "Select a valid vehicle type" }),
  }),
  attributes: z
    .array(
      z.object({
        key: z.string().min(1, "Attribute key is required"),
        value: z.string().min(1, "Attribute value is required"),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function VehicleRegistrationModal({ refresh }: { refresh: () => void }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      vehicleType: undefined,
      attributes: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await axiosClient.post("/vehicles/register", data);
      toast.success(response.data.message);
      refresh();
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
          <label>Plate number</label>
          <Input className="mt-2" placeholder="Plate Number, eg RAB123U" {...register("plateNumber")} />
          {errors.plateNumber && <p className="text-sm text-red-500">{errors.plateNumber.message}</p>}
        </div>

        <div>
          <label>Vehicle type</label>
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
          {errors.vehicleType && <p className="text-sm text-red-500">{errors.vehicleType.message}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="!mt-5 uppercase min-w-[200px]">
            {loading && <Spinner />} Register Vehicle <ArrowRight />
          </Button>
        </div>
      </form>
    </div>
  );
}
