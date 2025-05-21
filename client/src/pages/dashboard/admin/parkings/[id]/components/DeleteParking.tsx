"use client";

import { Button } from "@/components/ui/button";
import axiosClient from "@/config/axios.config";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function DeleteParking({ parkingId, onClose }: { parkingId: string; onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosClient.delete(`/parking/${parkingId}`);
      toast.success(response.data.message || "Parking deleted successfully.");
      navigate("/dashboard/admin/parkings");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete parking.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <p>Are you sure, this action cannot be undone!</p>
      <div className="flex gap-3 mt-3 justify-end">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Delete Parking"}
        </Button>
      </div>
    </div>
  );
}
