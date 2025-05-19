"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";

type Vehicle = {
  id: string;
  plateNumber: string;
  vehicleType: string;
  vehicleSize: string;
  ownerId: string;
  createdAt: string;
};

async function fetchVehicles(): Promise<Vehicle[]> {
  const res = await axiosClient.get("/vehicles");
  return res.data.data;
}

export default function AdminViewAllVehiclesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicles"],
    queryFn: fetchVehicles,
  });

  if (isError) {
    return <div className="p-4 text-red-500">Failed to load vehicles.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Registered Vehicles</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : data?.map((vehicle) => (
              <div key={vehicle.id} className="p-4">
                <div className="p-0 space-y-2">
                  <div className="text-lg font-semibold">{vehicle.plateNumber}</div>
                  <span>{vehicle.vehicleType}</span>
                  <div className="text-sm text-muted-foreground">Size: {vehicle.vehicleSize}</div>
                  <div className="text-xs text-muted-foreground">Registered on: {new Date(vehicle.createdAt).toLocaleDateString()}</div>
                  {/* Placeholder for future actions */}
                  <Button variant="outline" className="mt-2 w-full">
                    View Owner
                  </Button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
