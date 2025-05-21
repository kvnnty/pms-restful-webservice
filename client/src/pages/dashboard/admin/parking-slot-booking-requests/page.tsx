import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { BookingRequest } from "@/types/parking-slot-booking-request";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminViewAllParkingSlotRequestsPage() {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      try {
        const response = await axiosClient("/booking-requests/");
        setBookingRequests(response.data.data.data);
      } catch (err: any) {
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingRequests();
  }, []);

  const columns: ColumnDef<BookingRequest>[] = [
    {
      accessorKey: "user",
      header: "Customer ",
      cell: ({ row }) => (
        <div>
          <h3 className="font-semibold">
            {row.original.user.firstName} {row.original.user.lastName}
          </h3>
          <span className="text-sm text-gray-400">{row.original.user.email}</span>,
        </div>
      ),
    },
    {
      accessorKey: "slot",
      header: "Parking Spot Details",
      cell: ({ row }) => (
        <div>
          <div>
            <p>
              Parking name: <strong>{row.original.slot.parking?.name}</strong>
            </p>
            <p className="mt-2">
              Parking Slot number: <strong>{row.original.slot.slotNumber}</strong>
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle Details",
      cell: ({ row }) => {
        return (
          <div>
            <p>
              Vehicle plate number:{" "}
              <Link to={`/dashboard/admin/vehicles/${row.original.vehicleId}`}>
                <span className="px-2 py-1 bg-gray-200 rounded">{row.original.vehicle.plateNumber}</span>
              </Link>
            </p>
            <p className="mt-2">
              Vehicle type: <strong>{row.original.vehicle.vehicleType}</strong>
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Request Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={clsx("px-2 py-1 rounded", status == "APPROVED" ? "bg-green-200" : status === "PENDING" ? "bg-yellow-200" : "bg-red-200")}>
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Requested At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const handleDecision = async (status: "APPROVED" | "REJECTED") => {
          try {
            const response = await axiosClient.post(`/booking-requests/${row.original.id}/decide`, { status });
            toast.success(response.data.message);
            setBookingRequests((prev) => prev.map((r) => (r.id === row.original.id ? { ...r, status } : r)));
          } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update request");
          }
        };

        return (
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={() => handleDecision("APPROVED")} disabled={row.original.status !== "PENDING"}>
              Approve
            </Button>
            <Button variant="outline" onClick={() => handleDecision("REJECTED")} disabled={row.original.status !== "PENDING"}>
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: bookingRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Parking Slot Booking Requests</h2>
      <Table className="mt-5">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        {loading ? (
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
    </div>
  );
}
