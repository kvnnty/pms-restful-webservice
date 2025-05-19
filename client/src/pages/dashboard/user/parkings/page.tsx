"use client";

import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function UserParkingsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parkings"],
    queryFn: async () => {
      const res = await axiosClient.get("/parking");
      return res.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="p-4 text-red-500">Error: {(error as any).message}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Available Parking Lots</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((parking: any) => (
          <Link to={`/dashboard/parkings/${parking.id}`} key={parking.id} className="border rounded-2xl p-5">
            <div>
              <div className="text-lg font-semibold">{parking.name}</div>
              <p className="text-sm text-gray-600 mt-3">{parking.address}</p>
              <p className="text-sm text-gray-600 mt-2">
                RWF {parking.pricePerHour}/hour — Capacity: {parking.capacity} vehicles
              </p>
            </div>
            <div></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
