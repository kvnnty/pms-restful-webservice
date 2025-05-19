"use client";

import GlobalDialog from "@/components/GlobalDialog";
import { Button } from "@/components/ui/button";
import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VehicleRegistrationModal from "./components/VehicleRegistrationModal";

export default function MyVehiclesPage() {
  const navigate = useNavigate();
  const [isVehicleRegistrationModalOpen, setIsVehicleRegistrationModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myVehicles"],
    queryFn: async () => {
      const res = await axiosClient.get("/vehicles/user");
      return res.data.data;
    },
  });

  if (isLoading) return <div className="p-4">Loading vehicles...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {(error as any).message}</div>;

  return (
    <>
      <div className="space-y-6 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <Button onClick={() => setIsVehicleRegistrationModalOpen(true)}>Register New Vehicle</Button>
        </div>

        {data.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.map((v: any) => (
              <li key={v.id} className="p-4 border rounded-2xl shadow-sm hover:shadow-md transition bg-white space-y-2">
                <div>
                  <h2 className="text-lg font-semibold">{v.plateNumber}</h2>
                  <p>Type: {v.vehicleType}</p>
                  <p>Size: {v.vehicleSize}</p>
                  <p className="text-sm text-gray-500">Added on {new Date(v.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => navigate(`/dashboard/user/vehicles/${v.id}`)}>
                    View
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No vehicles found.</p>
        )}
      </div>
      <GlobalDialog isOpen={isVehicleRegistrationModalOpen} setIsOpen={setIsVehicleRegistrationModalOpen} title="Register New Vehicle" maxWidth={700}>
        <VehicleRegistrationModal />
      </GlobalDialog>
    </>
  );
}
