import GlobalDialog from "@/components/GlobalDialog";
import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { Parking } from "@/types/parking";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import RecordVehicleEntryModal from "./components/RecordVehicleEntryModal";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import type { ParkingSession } from "@/types/parking-session";

export default function AttendantViewParkingDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState<Parking | null>(null);
  const [parkingSessions, setParkingSessions] = useState<ParkingSession[]>([]);
  const [loadingParking, setLoadingParking] = useState(true);
  const [loadingParkingSessions, setLoadingParkingSessions] = useState(true);
  const [recordVehicleEntryModalOpen, setRecordVehicleEntryModalOpen] = useState(false);
  const [recordExitPending, setRecordExitPending] = useState<boolean>(false);

  if (!id) {
    navigate("/dashboard");
    return null;
  }

  const fetchParkingData = async () => {
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
      const res = await axiosClient.get(`/parking-sessions`);
      setParkingSessions(res.data.data);
    } catch (err: any) {
      toast.error("Failed to fetch parking sessions");
      console.error("Failed to fetch parking sessions:", err);
    } finally {
      setLoadingParkingSessions(false);
    }
  };

  const recordVehicleExit = async (vehicleId: string) => {
    setRecordExitPending(true);
    try {
      await axiosClient.post("/parking-sessions/exit", {
        vehicleId,
      });
      toast.success("Vehicle exit recorded");
      fetchParkingSessions();
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setRecordExitPending(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoadingParking(true);
    fetchParkingData();

    setLoadingParkingSessions(true);
    fetchParkingSessions();
  }, [id]);

  const columns: ColumnDef<ParkingSession>[] = [
    {
      accessorKey: "user",
      header: "Customer ",
      cell: ({ row }) => (
        <div>
          <h3 className="font-semibold">
            {row.original.user.firstName} {row.original.user.lastName}
          </h3>
          <span className="text-sm text-gray-400">{row.original.user.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "vehicle.plateNumber",
      header: "Plate Number",
      cell: ({ row }) => <span className="font-medium bg-gray-200 px-3 py-2 rounded">{row.original.vehicle?.plateNumber ?? "N/A"}</span>,
    },

    {
      accessorKey: "entryTime",
      header: "Entry Time",
      cell: ({ row }) => new Date(row.original.entryTime).toLocaleString(),
    },
    {
      accessorKey: "exitTime",
      header: "Exit Time",
      cell: ({ row }) => (row.original.exitTime ? new Date(row.original.exitTime).toLocaleString() : "—"),
    },
    {
      accessorKey: "feePaid",
      header: "Total Fee To Be Paid",
      cell: ({ row }) => <span>{row.original.chargedAmount ?? "—"} RWF</span>,
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => (
        <Button disabled={row.original.isExited || recordExitPending} onClick={() => recordVehicleExit(row.original.vehicleId)}>
          {recordExitPending ? "Submitting..." : "Record exit"}
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: parkingSessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loadingParking) return <div className="p-4">Loading parking details...</div>;
  if (!parking) return <div className="p-4 text-red-600">Parking not found.</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{parking.name}</h1>
        </div>
        <p className="text-gray-700">
          Located at <strong>{parking.location}</strong>
        </p>
        <div className="text-gray-600 border p-4 rounded-lg">
          <p>
            Price: <strong>{parking.pricePerHour} RWF / hour</strong>
          </p>
          <p className="mt-2">
            Capacity: <strong>{parking.capacity} vehicles</strong>
          </p>
          <div className="bg-gray-200 px-3 py-1 mt-3 w-fit rounded">{parking.availableSlots} spots available</div>
        </div>

        <section className="border-t pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Manage Vehicle exit and entry</h2>
            <Button onClick={() => setRecordVehicleEntryModalOpen(true)}>
              Record vehicle entry <ArrowRight />
            </Button>
          </div>
        </section>

        <section className="border-t pt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">All parking sessions</h2>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {loadingParkingSessions ? (
              <TableLoader columnCount={columns.length} />
            ) : (
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
        </section>
      </div>

      <GlobalDialog isOpen={recordVehicleEntryModalOpen} setIsOpen={setRecordVehicleEntryModalOpen} title="Record vehicle entry into parking">
        <RecordVehicleEntryModal refresh={fetchParkingSessions} onClose={() => setRecordVehicleEntryModalOpen(false)} />
      </GlobalDialog>
    </>
  );
}
