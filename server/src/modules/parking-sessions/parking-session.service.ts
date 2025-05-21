import { BookingRequestStatus } from "@prisma/client";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { prisma } from "../../prisma/client";
import vehicleService from "../vehicles/vehicle.service";

class ParkingSessionService {
  recordEntry = async (vehicleId: string) => {
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    const slotRequest = await prisma.bookingRequest.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: BookingRequestStatus.APPROVED,
      },
      include: {
        slot: true,
      },
    });

    if (!slotRequest) throw new BadRequestException("No approved parking spot bookings found this vehicle");

    await prisma.parkingSession.create({
      data: {
        vehicleId: vehicle.id,
        slotId: slotRequest.slot!.id,
        userId: vehicle.ownerId,
      },
    });
  };
  getParkingSessions = async () => {
    return await prisma.parkingSession.findMany({ include: { user: true, slot: true, vehicle: true } });
  };

  recordExit = async (vehicleId: string) => {
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    const slotRequest = await prisma.bookingRequest.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: BookingRequestStatus.COMPLETE,
      },
      include: {
        slot: true,
      },
    });

    if (!slotRequest) throw new BadRequestException("No approved parking spot bookings found this vehicle");

    const mostRecentSession = await prisma.parkingSession.findFirst({
      where: { vehicleId },
      orderBy: { entryTime: "desc" },
    });

    if (mostRecentSession) {
      await prisma.parkingSession.update({
        where: { id: mostRecentSession.id },
        data: {
          exitTime: new Date(),
        },
      });
    }
  };
}

export default new ParkingSessionService();
