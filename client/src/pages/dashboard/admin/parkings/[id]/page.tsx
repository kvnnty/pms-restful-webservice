"use client";

import GlobalDialog from "@/components/GlobalDialog";
import { Button } from "@/components/ui/button";
import axiosClient from "@/config/axios.config";
import type { Parking } from "@/types/parking";
import type { ParkingSlot } from "@/types/parking-slot";
import { Edit, Plus, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AddParkingSpots from "./components/AddParkingSpots";
import DeleteParking from "./components/DeleteParking";
import UpdateParkingDetails from "./components/UpdateParkingDetails";
import clsx from "clsx";

export default function AdminViewParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parking, setParking] = useState<Parking | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loadingParking, setLoadingParking] = useState(true);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

  const [isAddingParkingModalOpen, setIsAddingParkingModalOpen] = useState(false);
  const [isEditingParkingModalOpen, setIsEditingParkingModalOpen] = useState(false);
  const [isDeleteParkingModalOpen, setIsDeleteParkingModalOpen] = useState(false);

  if (!id) {
    navigate("/dashboard");
    return;
  }

  const fetchParkingData = async (id: string) => {
    try {
      const res = await axiosClient.get(`/parking/${id}`);
      setParking(res.data.data);
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.error("Failed to fetch parking details:", err);
    } finally {
      setLoadingParking(false);
    }
  };

  const fetchParkingSlots = async (id: string) => {
    try {
      const res = await axiosClient.get(`/parking/${id}/parking-slots`, {
        params: { page, limit },
      });
      setParkingSlots(res.data.data.data);
    } catch (err: any) {
      console.error("Failed to fetch parking slots:", err);
    } finally {
      setLoadingParkingSlots(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoadingParking(true);
    fetchParkingData(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingParkingSlots(true);
    fetchParkingSlots(id);
  }, [id, page]);

  if (loadingParking) return <div className="p-4">Loading parking details...</div>;

  if (!parking) return <div className="p-4 text-red-600">Parking not found.</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{parking.name}</h1>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditingParkingModalOpen(true)} variant="outline">
              <Edit /> Edit
            </Button>
            <Button onClick={() => setIsDeleteParkingModalOpen(true)} variant="outline">
              <Trash /> Delete
            </Button>
          </div>
        </div>
        <p className="text-gray-700">
          Located at <strong> {parking.location}</strong>
        </p>
        <div className="text-gray-600 border p-4 rounded-lg">
          <p className="text-gray-600">
            Price: <strong>{parking.pricePerHour} RWF / hour</strong>
          </p>
          <p className="text-gray-600 mt-2">
            Capacity: <strong>{parking.capacity} vehicles</strong>
          </p>
          <div className="bg-gray-200 px-3 py-1 mt-3 w-fit rounded">{parking.availableSlots} spots available</div>
        </div>

        <section className="border-t pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Parking Spots</h2>
            <Button onClick={() => setIsAddingParkingModalOpen(true)}>
              <Plus />
              Add Parking spots
            </Button>
          </div>

          <div className="mt-5">
            {loadingParkingSlots ? (
              <p>Loading slots...</p>
            ) : parkingSlots.length === 0 ? (
              <p className="text-gray-500">No slots found for this parking.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {parkingSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border rounded-2xl p-3 text-sm ${
                      slot.status === "AVAILABLE" ? "bg-green-100 text-green-900 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                    <p>
                      Slot: <strong>{slot.slotNumber}</strong>
                    </p>
                    <p>
                      Type: <strong>{slot.vehicleType}</strong>
                    </p>
                    <p
                      className={clsx(
                        "mt-5 font-semibold px-3 py-1 rounded-full text-center max-w-fit",
                        slot.status === "AVAILABLE" ? "bg-green-200 text-green-600 border-green-200" : "bg-gray-200 text-gray-600 border-gray-200"
                      )}>
                      {slot.status}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination controls */}
            <div className="mt-6 flex gap-4">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loadingParkingSlots}>
                Previous
              </button>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => p + 1)}
                disabled={parkingSlots.length < limit || loadingParkingSlots}>
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
      <GlobalDialog isOpen={isEditingParkingModalOpen} setIsOpen={setIsEditingParkingModalOpen} title="Edit Parking Details" maxWidth={600}>
        <UpdateParkingDetails parking={parking} onClose={() => setIsEditingParkingModalOpen(false)} />
      </GlobalDialog>
      <GlobalDialog isOpen={isDeleteParkingModalOpen} setIsOpen={setIsDeleteParkingModalOpen} title="Remove Parking facility">
        <DeleteParking parkingId={id} onClose={() => setIsDeleteParkingModalOpen(false)} />
      </GlobalDialog>
      <GlobalDialog isOpen={isAddingParkingModalOpen} setIsOpen={setIsAddingParkingModalOpen} title="Add Bulk Parking Spots" maxWidth={900}>
        <AddParkingSpots parkingId={id} refresh={() => fetchParkingSlots(id)} onClose={() => setIsAddingParkingModalOpen(false)} />
      </GlobalDialog>
    </>
  );
}
