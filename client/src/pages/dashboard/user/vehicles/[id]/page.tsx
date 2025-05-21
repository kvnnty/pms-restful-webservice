import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function UserVehicleDetailsPage() {
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

  return <div>VehicleByIdPage</div>;
}
