import TableLoader from "@/components/loaders/TableLoader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axiosClient from "@/config/axios.config";
import type { Vehicle } from "@/types/vehicle";
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateBooking({ slotId }: { slotId: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitPending, setSubmitPending] = useState<boolean>(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axiosClient.get("/vehicles/user");
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

  const confirmBooking = async () => {
    setSubmitPending(false);
    try {
      await axiosClient.post("/booking-requests/", {
        vehicleId: selectedVehicle?.id,
        slotId: slotId,
      });
      navigate("/dashboard/user/booking-requests");
    } catch (err: any) {
      toast.error(err.response.data.message);
      console.log(err);
    } finally {
      setSubmitPending(false);
    }
  };

  const columns: ColumnDef<Vehicle>[] = [
    {
      accessorKey: "plateNumber",
      header: "Plate Number",
    },
    {
      accessorKey: "vehicleType",
      header: "Type",
    },
  ];

  const table = useReactTable({
    data: vehicles,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
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
              <TableRow
                key={row.id}
                onClick={() => setSelectedVehicle(row.original)}
                className={clsx(row.original.id == selectedVehicle?.id && "bg-primary hover:bg-primary text-white")}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      <div className="mt-3 flex justify-end">
        <Button onClick={confirmBooking} disabled={!selectedVehicle}>
          {submitPending ? "Submitting.." : "Confirm booking"}
        </Button>
      </div>
    </div>
  );
}
