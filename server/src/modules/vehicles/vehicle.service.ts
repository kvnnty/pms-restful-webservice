import { DuplicateResourceException } from "../../exceptions/duplicate-resource.exception";
import { ForbiddenException } from "../../exceptions/forbidden.exception";
import { ResourceNotFoundException } from "../../exceptions/resource-not-found.exception";
import { prisma } from "../../prisma/client";
import { RegisterVehicleDto, UpdateVehicleDto } from "./vehicle.dto";

class VehicleService {
  createVehicle = async ({ data, userId }: { data: RegisterVehicleDto; userId: string }) => {
    const { plateNumber, ...rest } = data;
    console.log(data);
    const existing = await prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (existing) {
      throw new DuplicateResourceException("Vehicle with this plate number already exists.");
    }

    return prisma.vehicle.create({
      data: {
        ...rest,
        plateNumber,
        ownerId: userId,
      },
    });
  };

  updateVehicle = async ({ userId, vehicleId, data }: { userId: String; vehicleId: string; data: UpdateVehicleDto }) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");

    if (vehicle.ownerId != userId) {
      throw new ForbiddenException("You are not allowed to update this vehicle");
    }

    if (data.plateNumber && data.plateNumber !== vehicle.plateNumber) {
      const exists = await prisma.vehicle.findUnique({
        where: { plateNumber: data.plateNumber },
      });
      if (exists) throw new DuplicateResourceException("Another vehicle with this plate number exists");
    }

    return prisma.vehicle.update({
      where: { id: vehicleId },
      data,
    });
  };

  deleteVehicle = async ({ userId, vehicleId }: { vehicleId: string; userId: String }) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");

    if (vehicle.ownerId != userId) {
      throw new ForbiddenException("You are not allowed to delete this vehicle");
    }

    return prisma.vehicle.delete({ where: { id: vehicleId } });
  };
  getVehicleById = async (vehicleId: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId }, include: { owner: true } });
    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");
    return vehicle;
  };

  getVehicleByPlateNumber = async (plateNumber: string) => {
    const vehicle = await prisma.vehicle.findUnique({ where: { plateNumber }, include: { owner: true, slotRequests: true } });
    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");
    return vehicle;
  };

  getVehiclesByUser = async (userId: string) => {
    return await prisma.vehicle.findMany({ where: { ownerId: userId } });
  };

  getAllVehicles = async () => {
    return await prisma.vehicle.findMany();
  };
}

export default new VehicleService();
