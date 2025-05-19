"use client";

import TableLoader from "@/components/loaders/TableLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import { useQuery } from "@tanstack/react-query";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useMemo } from "react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await axiosClient.get("/users");
  return res.data.data;
}

export default function AdminAllViewUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "user",
        header: "Customer ",
        cell: ({ row }) => (
          <div>
            <h3 className="font-semibold">
              {row.original.firstName} {row.original.lastName}
            </h3>
            <span className="text-sm text-gray-400">{row.original.email}</span>,
          </div>
        ),
      },
      { accessorKey: "role", header: "Role" },
      {
        accessorKey: "isVerified",
        header: "Verified",
        cell: ({ row }) => (
          <span className={clsx("px-2 rounded", row.original.isVerified ? "bg-green-200" : "bg-yellow-200")}>{row.original.isVerified ? "Yes" : "No"}</span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Registered Users</h2>
      <Table className="mt-5 min-w-full text-sm text-left">
        <TableHeader className="bg-gray-100">
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
        {isLoading ? (
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
