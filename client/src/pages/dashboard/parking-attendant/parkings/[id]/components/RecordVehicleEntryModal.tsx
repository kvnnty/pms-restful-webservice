import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosClient from "@/config/axios.config";
import type { Vehicle } from "@/types/vehicle";
import { useState } from "react";
import toast from "react-hot-toast";

export default function RecordVehicleEntryModal({ refresh, onClose }: { refresh: () => void; onClose: () => void }) {
  const [searching, setSearching] = useState<boolean>(false);
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [plateNumberInput, setPlateNumberInput] = useState("");

  const searchVehicle = async () => {
    setSearching(true);
    try {
      const response = await axiosClient.get(`/vehicles/plateNumber/${plateNumberInput}`);
      setVehicle(response.data.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setSearching(false);
    }
  };

  const recordVehicleEntry = async () => {
    setSubmitPending(false);
    try {
      await axiosClient.post("/parking-sessions/entry", {
        vehicleId: vehicle?.id,
      });
      toast.success("Vehicle entry recorded");
      refresh();
      onClose();
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setSubmitPending(false);
    }
  };

  return (
    <div>
      <h2>Enter vehicle number plate</h2>
      <div className="flex gap-2 mt-2">
        <Input onChange={(e) => setPlateNumberInput(e.target.value)} className="w-full" placeholder="Enter vehicle number plate eg.  RAH123P" />
        <Button onClick={searchVehicle} disabled={!plateNumberInput.trim()}>
          {searching ? "Searching.." : "Search"}
        </Button>
      </div>

      {vehicle && (
        <div className="space-y-5 mt-5">
          <div className="border p-4 rounded-xl space-y-3">
            <h3 className="font-semibold">About vehicle</h3>
            <div className="flex items-center">
              <h4 className="w-full">Plate number</h4>
              <div className="w-full font-medium bg-gray-200 px-3 py-2 rounded">{vehicle.plateNumber}</div>
            </div>
            <div className="flex items-center">
              <h4 className="w-full">Vehicle type</h4>
              <div className="w-full font-medium bg-gray-200 px-3 py-2 rounded">{vehicle.vehicleType}</div>
            </div>
          </div>
          <div className="border p-4 rounded-xl">
            <h3 className="font-semibold">Vehicle owner</h3>
            <h3 className="mt-3">
              {vehicle.owner.firstName} {vehicle.owner.lastName}
            </h3>
            <span className="text-sm text-gray-400">{vehicle.owner.email}</span>
          </div>
          {/* <div className="border p-4 rounded-xl">
            <h3 className="font-semibold">Booked parking spot</h3>
            <div className="flex items-center">
              <h4 className="w-full">Parking Slot Number</h4>
              <div className="w-full font-medium bg-gray-200 px-3 py-2 rounded">{vehicle.bookingRequests[0].slot.slotNumber}</div>
            </div>
            <div className="flex items-center">
              <h4 className="w-full">Parking Name</h4>
              <div className="w-full font-medium bg-gray-200 px-3 py-2 rounded">{vehicle.bookingRequests[0].slot.parking?.name}</div>
            </div>
          </div> */}
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Button onClick={recordVehicleEntry} disabled={!vehicle}>
          {submitPending ? "Submitting.." : "Confirm booking"}
        </Button>
      </div>
    </div>
  );
}
