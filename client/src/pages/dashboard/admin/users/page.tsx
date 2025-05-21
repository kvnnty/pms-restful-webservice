"use client";

import GlobalDialog from "@/components/GlobalDialog";
import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import RegisterParkingAttendantModal from "./components/RegisterParkingAttendantModal";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
};

export default function AdminAllViewUsersPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isRegisterParkingAttendantModalOpen, setRegisterParkingAttendantModalOpen] = useState(false);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axiosClient.get("/users");
      setUsers(res.data.data);
    } catch (error: any) {
      toast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

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
            <span className="text-sm text-gray-400">{row.original.email}</span>
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
        header: "Joined On",
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-bold">Registered Users</h2>
          <Button onClick={() => setRegisterParkingAttendantModalOpen(true)}>Register parking attendant</Button>
        </div>
        <Table className="mt-5 min-w-full text-sm text-left">
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
      <GlobalDialog isOpen={isRegisterParkingAttendantModalOpen} setIsOpen={setRegisterParkingAttendantModalOpen} title="Add new parking lot attendant">
        <RegisterParkingAttendantModal refresh={fetchUsers} onClose={() => setRegisterParkingAttendantModalOpen(false)} />
      </GlobalDialog>
    </>
  );
}
