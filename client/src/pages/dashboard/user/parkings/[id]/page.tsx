import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/config/axios.config";

export default function UserViewParkingDetailsPage() {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["parkingDetails", id],
    queryFn: async () => {
      const res = await axiosClient.get(`/parking/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div className="text-red-500">Error: {(error as any).message}</div>;

  const { name, address, pricePerHour, capacity, parkingSlots } = data;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-gray-600">{address}</p>
      <p>Price: {pricePerHour} RWF/hr</p>
      <p>Capacity: {capacity}</p>

      <h2 className="text-xl mt-6 font-semibold">Slots</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {parkingSlots.map((slot: any) => (
          <li key={slot.id} className="p-4 border rounded-xl bg-white space-y-1 shadow-sm">
            <div className="font-medium">{slot.slotNumber}</div>
            <div>Type: {slot.vehicleType}</div>
            <div>Size: {slot.vehicleSize}</div>
            <div>Location: {slot.location}</div>
            <div>Status: {slot.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
