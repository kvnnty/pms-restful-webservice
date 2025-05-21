import { ParkingSlotStatus, PrismaClient } from "@prisma/client";
import { CreateParkingDto, UpdateParkingDto } from "./parking.dto";
import { ResourceNotFoundException } from "../../exceptions/resource-not-found.exception";
import parkingUtil from "../../utils/parking.util";
const prisma = new PrismaClient();

export class ParkingService {
  async create(data: CreateParkingDto) {
    const code = await parkingUtil.generateParkingCode();
    return await prisma.parking.create({ data: { code, ...data } });
  }

  async findAll() {
    return await prisma.parking.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    const [parking, availableSlotCount] = await prisma.$transaction([
      prisma.parking.findUnique({
        where: { id },
        include: { parkingSlots: true },
      }),
      prisma.parkingSlot.count({
        where: {
          parkingId: id,
          status: ParkingSlotStatus.AVAILABLE,
        },
      }),
    ]);

    if (!parking) {
      throw new ResourceNotFoundException("Invalid parking ID. The specified parking does not exist.");
    }

    return {
      ...parking,
      availableSlots: availableSlotCount,
    };
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
