"use client";

import { useEffect, useState } from "react";
import axiosClient from "@/config/axios.config";
import { useParams } from "react-router-dom";

type Parking = {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  capacity: number;
};

type ParkingSlot = {
  id: string;
  slotNumber: string;
  vehicleSize: string;
  vehicleType: string;
  location: string;
  status: string;
};

export default function AdminViewParkingDetailsPage() {
  const { id } = useParams();
  const [parking, setParking] = useState<Parking | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loadingParking, setLoadingParking] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5; // fixed limit for slots pagination

  // Fetch parking details
  useEffect(() => {
    if (!id) return;

    setLoadingParking(true);
    axiosClient
      .get(`/parking/${id}`)
      .then((res) => {
        setParking(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch parking details:", err);
      })
      .finally(() => setLoadingParking(false));
  }, [id]);

  // Fetch parking slots with pagination
  useEffect(() => {
    if (!id) return;

    setLoadingSlots(true);
    axiosClient
      .get(`/parking/${id}/parking-slots`, {
        params: { page, limit },
      })
      .then((res) => {
        setSlots(res.data.data.data); // nested data per your API response
      })
      .catch((err) => {
        console.error("Failed to fetch parking slots:", err);
      })
      .finally(() => setLoadingSlots(false));
  }, [id, page]);

  if (loadingParking) return <div className="p-4">Loading parking details...</div>;

  if (!parking) return <div className="p-4 text-red-600">Parking not found.</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{parking.name}</h1>
      <p className="text-gray-700">{parking.address}</p>
      <p className="text-gray-600">
        Price per hour: <strong>{parking.pricePerHour} RWF</strong> | Capacity: <strong>{parking.capacity}</strong>
      </p>

      <section>
        <h2 className="text-xl font-semibold mb-4">Parking Slots (Page {page})</h2>

        {loadingSlots ? (
          <p>Loading slots...</p>
        ) : slots.length === 0 ? (
          <p className="text-gray-500">No slots found for this parking.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {slots.map((slot) => (
              <div key={slot.id} className={`border rounded p-3 shadow-sm text-sm ${slot.status === "AVAILABLE" ? "text-green-600" : "text-red-600"}`}>
                <p>
                  <strong>Slot:</strong> {slot.slotNumber}
                </p>
                <p>
                  <strong>Type:</strong> {slot.vehicleType}
                </p>
                <p>
                  <strong>Size:</strong> {slot.vehicleSize}
                </p>
                <p>
                  <strong>Location:</strong> {slot.location}
                </p>
                <p className="font-semibold">{slot.status}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination controls */}
        <div className="mt-6 flex gap-4">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loadingSlots}>
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={slots.length < limit || loadingSlots}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
