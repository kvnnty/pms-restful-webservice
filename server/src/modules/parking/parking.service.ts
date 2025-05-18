import { PrismaClient } from "@prisma/client";
import { CreateParkingDto, UpdateParkingDto } from "./parking.dto";
import { ResourceNotFoundException } from "../../exceptions/resource-not-found.exception";

const prisma = new PrismaClient();

export class ParkingService {
  async create(data: CreateParkingDto) {
    return await prisma.parking.create({ data });
  }

  async findAll() {
    return await prisma.parking.findMany({
      include: {
        parkingSlots: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const parking = await prisma.parking.findUnique({
      where: { id },
      include: { parkingSlots: true },
    });
    if (!parking) throw new ResourceNotFoundException("Invalid parking ID. The specified parking does not exist.");

    return parking;
  }

  async update(id: string, data: UpdateParkingDto) {
    const parking = await prisma.parking.findUnique({ where: { id } });
    if (!parking) throw new ResourceNotFoundException("Invalid parking ID. The specified parking does not exist.");

    return prisma.parking.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    const parking = await prisma.parking.findUnique({ where: { id } });
    if (!parking) throw new ResourceNotFoundException("Invalid parking ID. The specified parking does not exist.");

    return prisma.parking.delete({ where: { id } });
  }
}

export const parkingService = new ParkingService();
