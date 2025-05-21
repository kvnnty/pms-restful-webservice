"use client";

import TableLoader from "@/components/loaders/TableLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { BookingRequest } from "@/types/parking-slot-booking-request";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function UserBookingRequestsPage() {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookingRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/booking-requests/me");
        setBookingRequests(res.data.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load booking requests.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingRequests();
  }, []);

  const columns: ColumnDef<BookingRequest>[] = [
    {
      accessorKey: "vehicle.plateNumber",
      header: "Vehicle Plate Number",
      cell: ({ row }) => <span className="font-medium bg-gray-200 px-3 py-1 rounded">{row.original.vehicle.plateNumber}</span>,
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle Details",
      cell: ({ row }) => {
        return (
          <div>
            <p className="mt-2">
              Vehicle type: <strong>{row.original.vehicle.vehicleType}</strong>
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "slot",
      header: "Parking Spot Details",
      cell: ({ row }) => {
        return (
          <div>
            <p>
              Parking name: <strong>{row.original.slot.parking?.name}</strong>
            </p>
            <p className="mt-2">
              Parking Slot number: <strong>{row.original.slot.slotNumber}</strong>
            </p>
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span
            className={clsx(
              "px-2 py-1 rounded",
              status == "APPROVED" ? "bg-green-200" : status === "PENDING" ? "bg-yellow-200" : status === "COMPLETE" ? "bg-gray-200" : "bg-red-200"
            )}>
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
  ];

  const table = useReactTable({
    data: bookingRequests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Booking Requests</h2>
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
