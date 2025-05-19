import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { Vehicle } from "@/types/vehicle";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AdminViewAllVehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axiosClient.get("/vehicles");
        setVehicles(res.data.data);
      } catch (err: any) {
        toast.error(err.response.data.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
      cell: ({ row }) => <span className="font-medium bg-gray-200 px-3 py-2 rounded">{row.original.plateNumber}</span>,
    },
    {
      accessorKey: "vehicleType",
      header: "Type",
    },
    {
      accessorKey: "vehicleSize",
      header: "Size",
    },
    {
      accessorKey: "createdAt",
      header: "Registered On",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <Link to={`/dashboard/admin/vehicles/${row.original.id}`}>
            <Button variant="outline">View vehicle details</Button>
          </Link>
          <Link to={`/dashboard/admin/users/${row.original.ownerId}`}>
            <Button variant="outline">View Owner</Button>
          </Link>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: vehicles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Registered Vehicles</h2>
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
