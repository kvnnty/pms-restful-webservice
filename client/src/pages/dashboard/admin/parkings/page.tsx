"use client";

import GlobalDialog from "@/components/GlobalDialog";
import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { Parking } from "@/types/parking";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import CreateParkingModal from "./components/CreateParkingModal";

export default function AdminParkingsPage() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateParkingModalOpen, setIsCreateParkingModalOpen] = useState(false);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        setLoading(false);
        const res = await axiosClient.get("/parking");
        setParkings(res.data.data);
      } catch (err: any) {
        toast.error(err.response.data.message);
        console.error("Failed to fetch parkings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParkings();
  }, []);

  const columns: ColumnDef<Parking>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium bg-gray-200 px-3 py-2 rounded">{row.original.name}</span>,
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "capacity",
      header: "Parking Capacity",
      cell: ({ row }) => <span>{row.original.capacity} Vehicles</span>,
    },
    {
      accessorKey: "pricePerHour",
      header: "Price Per Hour",
      cell: ({ row }) => <span>{row.original.pricePerHour} RWF / hour </span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <span>
          <Link to={`/dashboard/admin/parkings/${row.original.id}`}>
            <Button>Go to management</Button>
          </Link>
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: parkings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">All Parkings</h1>
          <Button onClick={() => setIsCreateParkingModalOpen(true)}>Register new parking facility</Button>
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
      <GlobalDialog isOpen={isCreateParkingModalOpen} setIsOpen={setIsCreateParkingModalOpen} title="Add new Parking facility" maxWidth={700}>
        <CreateParkingModal />
      </GlobalDialog>
    </>
  );
}
