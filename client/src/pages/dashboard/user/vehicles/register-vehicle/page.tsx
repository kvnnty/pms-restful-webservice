"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import axiosClient from "@/config/axios.config";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
  plateNumber: z.string().min(3, "Plate number is required"),
  vehicleType: z.enum(["CAR", "MOTORCYCLE", "TRUCK"], {
    errorMap: () => ({ message: "Select a valid vehicle type" }),
  }),
  vehicleSize: z.enum(["SMALL", "MEDIUM", "LARGE"], {
    errorMap: () => ({ message: "Select a valid vehicle size" }),
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

export default function UserRegisterVehicle() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      vehicleType: undefined,
      vehicleSize: undefined,
      attributes: [],
    },
  });

  const {
    fields: attrFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "attributes",
  });
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const attributesObj = Object.fromEntries((data.attributes ?? []).map(({ key, value }) => [key, value]));

      const payload = {
        ...data,
        attributes: attributesObj,
      };

      const response = await axiosClient.post("/vehicles/register", payload);
      toast.success(response.data.message);
      navigate("/dashboard/vehicles");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Register New Vehicle</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Plate Number */}
        <div>
          <label>Plate number</label>
          <Input className="mt-2" placeholder="Plate Number, eg RAB123U" {...register("plateNumber")} />
          {errors.plateNumber && <p className="text-sm text-red-500">{errors.plateNumber.message}</p>}
        </div>

        {/* Vehicle Type */}
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

        {/* Vehicle Size */}
        <div>
          <label>Vehicle size</label>
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
          {errors.vehicleSize && <p className="text-sm text-red-500">{errors.vehicleSize.message}</p>}
        </div>

        {/* Attributes */}
        <div>
          <label className="block font-medium mb-1">Attributes</label>
          {attrFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 mb-2">
              <Input placeholder="eg. Color," {...register(`attributes.${index}.key`)} />
              <Input placeholder="eg. Black," {...register(`attributes.${index}.value`)} />
              <button type="button" onClick={() => remove(index)} className="w-full text-red-500 font-bold px-2 bg-gray-100 h-10 max-w-10 rounded-full">
                ×
              </button>
            </div>
          ))}
          <Button type="button" size={"sm"} variant="outline" onClick={() => append({ key: "", value: "" })}>
            <Plus /> Add Attribute
          </Button>

          {errors.attributes && (
            <p className="text-red-500 text-sm mt-2">
              {Array.isArray(errors.attributes) ? "All attributes must have both key and value" : "Invalid attributes"}
            </p>
          )}
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
