"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import TableLoader from "@/components/loaders/TableLoader";
import type { Bill } from "@/types/bill";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

export default function AdminViewBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/bills");
      setBills(res.data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const columns = useMemo<ColumnDef<Bill>[]>(
    () => [
      {
        accessorKey: "vehicle",
        header: "Vehicle Details",
        cell: ({ row }) => {
          return (
            <div className="my-2">
              <p>
                Plate number
                <span className="font-medium bg-gray-200 px-3 py-1 rounded">{row.original.vehicle.plateNumber}</span>
              </p>
              <p className="mt-2">
                Type: <strong>{row.original.vehicle.vehicleType}</strong>
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Amount (RWF)",
        cell: ({ row }) => `${row.original.amount.toLocaleString()} RWF`,
      },
      {
        accessorKey: "isPaid",
        header: "Is Paid",
        cell: ({ row }) => (
          <span className={clsx("px-2 rounded", row.original.isPaid ? "bg-green-200" : "bg-yellow-200")}>{row.original.isPaid ? "Yes" : "No"}</span>
        ),
      },
      {
        accessorKey: "issuedAt",
        header: "Issued At",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
      },
      {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => <Button disabled={row.original.isPaid}>Pay now</Button>,
      },
    ],
    []
  );

  const table = useReactTable({
    data: bills,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Bills</h2>
      <Table className="min-w-full text-sm text-left">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-4 py-2 font-medium">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        {loading ? (
          <TableLoader columnCount={columns.length} />
        ) : (
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
