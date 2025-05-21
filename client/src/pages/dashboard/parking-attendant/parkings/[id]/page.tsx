import GlobalDialog from "@/components/GlobalDialog";
import { Button } from "@/components/ui/button";
import axiosClient from "@/config/axios.config";
import type { Parking } from "@/types/parking";
import type { ParkingSlot } from "@/types/parking-slot";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import RecordVehicleEntryModal from "./components/RecordVehicleEntryModal";

export default function AttendantViewParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState<Parking | null>(null);
  const [parkingSessions, setParkingSessions] = useState<any[]>([]);
  const [loadingParking, setLoadingParking] = useState(true);
  const [loadingParkingSessions, setLoadingParkingSessions] = useState(true);
  const [parkingSessionModalOpen, setParkingSessionModalOpen] = useState(false);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loadingParkingSlots, setLoadingParkingSlots] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 5;

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

  const fetchParkingSessions = async () => {
    try {
      const res = await axiosClient.get(`/parking-sessions/`);
      setParkingSessions(res.data.data.data);
    } catch (err: any) {
      toast.error("Failed to fetch parking slots");
      console.error("Failed to fetch parking slots:", err);
    } finally {
      setLoadingParkingSessions(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoadingParking(true);
    fetchParkingData(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoadingParkingSessions(true);
    fetchParkingSessions();
    fetchParkingSlots(id);
  }, [id]);

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

  if (loadingParking) return <div className="p-4">Loading parking details...</div>;

  if (!parking) return <div className="p-4 text-red-600">Parking not found.</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{parking.name}</h1>
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
          <div className="bg-gray-200 px-3 py-1 mt-3 w-fit rounded">{parkingSlots.filter((slot) => slot.status === "AVAILABLE").length} spots available</div>
        </div>
        <section className="border-t pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Manage Vehicle exit and entry</h2>
            <Button onClick={() => setParkingSessionModalOpen(true)}>
              Record vehicle entry <ArrowRight />
            </Button>
          </div>
        </section>
        <section className="border-t pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">All parking sessions</h2>
          </div>
        </section>
      </div>
      <GlobalDialog isOpen={parkingSessionModalOpen} setIsOpen={setParkingSessionModalOpen} title="Record parking vehicle entry">
        <RecordVehicleEntryModal refresh={fetchParkingSessions} onClose={() => setParkingSessionModalOpen(false)} />
      </GlobalDialog>
    </>
  );
}
