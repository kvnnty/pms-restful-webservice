import { PrismaClient } from "@prisma/client";
import { CreateParkingDto, UpdateParkingDto } from "./parking.dto";

const prisma = new PrismaClient();

export class ParkingService {
  async create(data: CreateParkingDto) {
    return prisma.parking.create({ data });
  }

  async findAll() {
    return prisma.parking.findMany({
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
    if (!parking) throw new Error("Parking not found");
    return parking;
  }

  async update(id: string, data: UpdateParkingDto) {
    return prisma.parking.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.parking.delete({ where: { id } });
  }
}

export const parkingService = new ParkingService();
