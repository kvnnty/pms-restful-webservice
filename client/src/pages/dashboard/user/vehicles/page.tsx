"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function MyVehiclesPage() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["myVehicles"],
    queryFn: async () => {
      const res = await axiosClient.get("/vehicles/user");
      return res.data.data;
    },
  });

  const handleDelete = async (vehicleId: string) => {
    try {
      await axiosClient.delete(`/vehicles/${vehicleId}`);
      toast.success("Vehicle deleted");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete vehicle");
    }
  };

  if (isLoading) return <div className="p-4">Loading vehicles...</div>;
  if (isError) return <div className="p-4 text-red-500">Error: {(error as any).message}</div>;

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Vehicles</h1>
        <Link to="/dashboard/vehicles/register-vehicle">
          <Button>Register New Vehicle</Button>
        </Link>
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
                <Button variant="outline" onClick={() => navigate(`/dashboard/vehicles/${v.id}`)}>
                  View
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Update</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Vehicle</DialogTitle>
                    </DialogHeader>
                    <div className="text-sm text-gray-600">Update form goes here.</div>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>This action cannot be undone. This will permanently delete this vehicle.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <DialogClose className="px-4 rounded-lg text-white bg-gray-400">Cancel</DialogClose>
                      <Button onClick={() => handleDelete(v.id)}>Delete</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No vehicles found.</p>
      )}
    </div>
  );
}
