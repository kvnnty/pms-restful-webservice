import { BookingRequestStatus, LogStatus, ParkingSlotStatus, Role } from "@prisma/client";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { ForbiddenException } from "../../exceptions/forbidden.exception";
import { ResourceNotFoundException } from "../../exceptions/resource-not-found.exception";
import { prisma } from "../../prisma/client";
import mailUtil from "../../utils/mail.util";
import logsService from "../system-logs/system-logs.service";
import { CreateSlotRequestDto as CreateBookingRequestDto, DecisionDto, UpdateSlotRequestDto } from "./booking-request.dto";

class BookingRequestService {
  async createRequest({ userId, data }: { userId: string; data: CreateBookingRequestDto }) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
      include: { owner: true },
    });

    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");
    if (vehicle.ownerId !== userId) throw new ForbiddenException("You do not own this vehicle.");

    const existingPending = await prisma.bookingRequest.findFirst({
      where: {
        vehicleId: data.vehicleId,
        status: BookingRequestStatus.PENDING,
      },
    });

    if (existingPending) {
      throw new BadRequestException("You already have a pending booking request for this vehicle.");
    }
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: { id: data.slotId },
      include: {
        parking: true,
      },
    });
    if (!parkingSlot) throw new BadRequestException("Selected parking slot does not exist.");
    if (parkingSlot.status !== ParkingSlotStatus.AVAILABLE) {
      throw new BadRequestException("Selected parking slot is not available.");
    }

    if (parkingSlot.vehicleType !== vehicle.vehicleType) {
      throw new BadRequestException("Selected slot is not compatible with your vehicle type.");
    }

    await logsService.createLog({
      userId: vehicle.ownerId,
      action: `User with email: [${vehicle.owner?.email}] has requested for a spot in parking ${parkingSlot.parking!.name}`,
      status: LogStatus.SUCCESS,
    });

    return prisma.bookingRequest.create({
      data: {
        userId,
        vehicleId: data.vehicleId,
        slotId: data.slotId,
        status: BookingRequestStatus.PENDING,
      },
    });
  }

  async updateRequest({ data, bookingRequestId: requestId, userId }: { userId: string; bookingRequestId: string; data: UpdateSlotRequestDto }) {
    const request = await prisma.bookingRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.userId !== userId) {
      throw new ResourceNotFoundException("Booking request not found or unauthorized.");
    }

    if (request.status !== BookingRequestStatus.PENDING) {
      throw new BadRequestException("Only pending requests can be updated.");
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) throw new ResourceNotFoundException("Vehicle not found");
    if (vehicle.ownerId !== userId) throw new ForbiddenException("You do not own this vehicle.");

    return prisma.bookingRequest.update({
      where: { id: requestId },
      data: { vehicleId: data.vehicleId },
    });
  }

  async deleteRequest({ bookingRequestId, userId }: { userId: string; bookingRequestId: string }) {
    const request = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
    });

    if (!request || request.userId !== userId) {
      throw new ResourceNotFoundException("Booking request not found or unauthorized.");
    }

    if (request.status !== BookingRequestStatus.PENDING) {
      throw new BadRequestException("Only pending requests can be deleted.");
    }

    await prisma.bookingRequest.delete({ where: { id: bookingRequestId } });
  }

  async decideRequest({ bookingRequestId, decision }: { bookingRequestId: string; decision: DecisionDto }) {
    const bookingRequest = await prisma.bookingRequest.findUnique({
      where: { id: bookingRequestId },
      include: {
        vehicle: true,
        slot: {
          include: {
            parking: true,
          },
        },
      },
    });

    if (!bookingRequest) throw new ResourceNotFoundException("Booking request not found.");
    const user = await prisma.user.findUnique({ where: { id: bookingRequest.userId } });

    if (!user) throw new ResourceNotFoundException("User not found");

    if (bookingRequest.status !== BookingRequestStatus.PENDING) {
      throw new BadRequestException("Only pending requests can be decided.");
    }

    if (decision.status === BookingRequestStatus.REJECTED) {
      const html = `Hello ${user.lastName},\nWe're sad to inform you that your request to book a parking slot in ${bookingRequest.slot?.parking?.name} has been rejected`;
      mailUtil.sendEmail(user.email, "Parking Slot Booking Request rejected", html);

      return prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: BookingRequestStatus.REJECTED },
      });
    }

    if (bookingRequest.slot?.status !== ParkingSlotStatus.AVAILABLE) {
      throw new BadRequestException("The parking slot is no longer available.");
    }

    await prisma.$transaction([
      prisma.parkingSlot.update({
        where: { id: bookingRequest.slotId! },
        data: { status: ParkingSlotStatus.UNAVAILABLE },
      }),
      prisma.bookingRequest.update({
        where: { id: bookingRequestId },
        data: { status: BookingRequestStatus.APPROVED },
      }),
    ]);

    const html = `Hello ${user.lastName},\nWe're glad to inform you that your request to book a parking slot in ${bookingRequest.slot.parking?.name} has been approved`;
    mailUtil.sendEmail(user.email, "Parking Slot Booking Request Approved", html);

    return { message: "Booking approved and slot assigned." };
  }

  async listRequests(userId: string, role: Role, query: any) {
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role !== "ADMIN") where.userId = userId;
    if (status) where.status = status;

    const [data, total] = await prisma.$transaction([
      prisma.bookingRequest.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          vehicle: true,
          slot: {
            include: {
              parking: true,
            },
          },
        },
      }),
      prisma.bookingRequest.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getBySlotId(slotId: string) {
    return prisma.bookingRequest.findMany({
      where: { slotId },
      include: {
        vehicle: true,
        user: true,
      },
    });
  }
  async getUserBookingRequests(userId: string) {
    const user = prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new ResourceNotFoundException("User not found");

    return prisma.bookingRequest.findMany({
      where: { userId },
      include: {
        vehicle: true,
        user: true,
        slot: {
          include: {
            parking: true,
          },
        },
      },
    });
  }
}

export default new BookingRequestService();
