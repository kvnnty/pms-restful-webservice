import { ParkingSlot, Prisma, VehicleSize, VehicleType } from "@prisma/client";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { ResourceNotFoundException } from "../../exceptions/resource-not-found.exception";
import { prisma } from "../../prisma/client";
import parkingSlotUtil from "../../utils/parking.slot.util";
import { CreateBulkSlotsDto, CreateSlotDto, UpdateSlotDto } from "./parking-slot.dto";

class ParkingSlotService {
  async createSlot(data: CreateSlotDto): Promise<ParkingSlot> {
    const parking = await prisma.parking.findUnique({ where: { id: data.parkingId }, include: { parkingSlots: true } });

    if (!parking) throw new BadRequestException("Invalid parking ID. The specified parking does not exist.");

    if (parking.parkingSlots.length >= parking.capacity) throw new BadRequestException("Cannot create slot. Parking capacity has been reached.");

    const slotNumber = await parkingSlotUtil.generateSlotNumber("LOT1");
    return prisma.parkingSlot.create({
      data: {
        ...data,
        slotNumber,
      },
    });
  }

  async bulkCreateSlots(data: CreateBulkSlotsDto): Promise<void> {
    const parking = await prisma.parking.findUnique({ where: { id: data.parkingId } });
    if (!parking) throw new BadRequestException("Invalid parking ID. The specified parking does not exist.");

    const currentCount = await prisma.parkingSlot.count({
      where: { parkingId: data.parkingId },
    });

    const { count, ...rest } = data;

    if (currentCount >= parking.capacity) throw new BadRequestException("Cannot create slots. Parking capacity has been reached.");

    if (currentCount + count > parking.capacity)
      throw new BadRequestException(
        `Cannot create ${count} slots. Parking capacity is ${parking.capacity} vehicles. Only ${parking.capacity - currentCount} slot(s) available.`
      );

    const slotNumbers = await parkingSlotUtil.generateMultipleSlotNumbers("LOT1", count);
    const formatted = slotNumbers.map((_, index) => ({
      ...rest,
      slotNumber: slotNumbers[index],
    }));

    await prisma.parkingSlot.createMany({
      data: formatted,
      skipDuplicates: true,
    });
  }

  async listSlots({
    parkingId,
    page = 1,
    limit = 10,
    search = "",
    isAdmin = false,
    filters = {},
  }: {
    parkingId: string;
    page: number;
    limit: number;
    search?: string;
    isAdmin?: boolean;
    filters?: Prisma.ParkingSlotWhereInput;
  }) {
    const parking = await prisma.parking.findUnique({ where: { id: parkingId } });
    if (!parking) throw new BadRequestException("Invalid parking ID. The specified parking does not exist.");

    const searchUpper = search?.toUpperCase();
    const isValidVehicleType = searchUpper && Object.values(VehicleType).includes(searchUpper as VehicleType);
    const isValidVehicleSize = searchUpper && Object.values(VehicleSize).includes(searchUpper as VehicleSize);

    const where: Prisma.ParkingSlotWhereInput = {
      parkingId,
      ...(search && {
        OR: [
          { slotNumber: { contains: search, mode: "insensitive" } },
          ...(isValidVehicleType ? [{ vehicleType: { equals: searchUpper as VehicleType } }] : []),
          ...(isValidVehicleSize ? [{ vehicleSize: { equals: searchUpper as VehicleSize } }] : []),
        ],
      }),
      ...(isAdmin ? {} : { status: "AVAILABLE" }),
      ...filters,
    };

    const [slots, total] = await prisma.$transaction([
      prisma.parkingSlot.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.parkingSlot.count({ where }),
    ]);

    return {
      data: slots,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateSlot({ slotId, data }: { slotId: string; data: UpdateSlotDto }): Promise<ParkingSlot> {
    const existing = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
    if (!existing) throw new ResourceNotFoundException("Parking slot not found");

    return prisma.parkingSlot.update({
      where: { id: slotId },
      data,
    });
  }

  async deleteSlot(slotId: string): Promise<void> {
    const existing = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
    if (!existing) throw new ResourceNotFoundException("Parking slot not found");

    await prisma.parkingSlot.delete({ where: { id: slotId } });
  }

  async getSlotById(slotId: string): Promise<ParkingSlot> {
    const slot = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
    if (!slot) throw new ResourceNotFoundException("Parking slot not found");
    return slot;
  }

  async updateSlotStatus(slotId: string, status: "AVAILABLE" | "UNAVAILABLE"): Promise<ParkingSlot> {
    const existing = await prisma.parkingSlot.findUnique({ where: { id: slotId } });
    if (!existing) throw new ResourceNotFoundException("Parking slot not found");

    return prisma.parkingSlot.update({
      where: { id: slotId },
      data: { status },
    });
  }
}

export default new ParkingSlotService();
