"use client";

import axiosClient from "@/config/axios.config";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Parking = {
  id: string;
  name: string;
  address: string;
  pricePerHour: number;
  capacity: number;
};

export default function AdminParkingsPage() {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/parking")
      .then((res) => {
        const data = res.data.data || [];
        const simplified = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          pricePerHour: p.pricePerHour,
          capacity: p.capacity,
        }));
        setParkings(simplified);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch parkings:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4 text-gray-700">Loading parkings...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">All Parkings</h1>

      {parkings.length === 0 ? (
        <p className="text-gray-500">No parkings found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {parkings.map((parking) => (
            <Link to={`/dashboard/admin/parkings/${parking.id}`} key={parking.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white">
              <h2 className="text-lg font-semibold">{parking.name}</h2>
              <p className="text-gray-600">{parking.address}</p>
              <p className="text-sm text-gray-500">
                <strong>{parking.pricePerHour} RWF</strong> per hour · <strong>{parking.capacity}</strong> slots
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
