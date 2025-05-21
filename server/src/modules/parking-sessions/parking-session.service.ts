import { BookingRequestStatus, LogStatus } from "@prisma/client";
import { BadRequestException } from "../../exceptions/bad-request.exception";
import { prisma } from "../../prisma/client";
import vehicleService from "../vehicles/vehicle.service";
import logsService from "../system-logs/system-logs.service";
import billsService from "../bills/bills.service";
import mailUtil from "../../utils/mail.util";
import logger from "../../utils/logger.util";

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

    const existingEntry = await prisma.parkingSession.findFirst({ where: { vehicleId, isExited: false } });
    if (existingEntry) throw new BadRequestException("Vehicle is already ...");

    await prisma.parkingSession.create({
      data: {
        vehicleId: vehicle.id,
        slotId: slotRequest.slot!.id,
        userId: vehicle.ownerId,
      },
    });
  };

  getParkingSessions = async () => {
    return await prisma.parkingSession.findMany({
      include: {
        user: true,
        slot: true,
        vehicle: true,
      },
      orderBy: {
        entryTime: "desc",
      },
    });
  };

  recordExit = async (vehicleId: string) => {
    const vehicle = await vehicleService.getVehicleById(vehicleId);

    const bookingRequest = await prisma.bookingRequest.findFirst({
      where: {
        vehicleId: vehicle.id,
        status: BookingRequestStatus.APPROVED,
      },
      include: {
        slot: {
          include: {
            parking: true,
          },
        },
      },
    });

    if (!bookingRequest) throw new BadRequestException("No approved parking spot bookings found for this vehicle");

    const mostRecentSession = await prisma.parkingSession.findFirst({
      where: { vehicleId, isExited: false },
      orderBy: { entryTime: "desc" },
    });

    if (!mostRecentSession) throw new BadRequestException("No active parking session found for this vehicle");

    const now = new Date();
    const entryTime = new Date(mostRecentSession.entryTime);
    const durationMs = now.getTime() - entryTime.getTime();
    const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));

    const feePerHour = bookingRequest.slot!.parking?.pricePerHour || 500;
    const totalFee = durationHours * feePerHour;

    const updatedSession = await prisma.parkingSession.update({
      where: { id: mostRecentSession.id },
      data: {
        exitTime: now,
        isExited: true,
        chargedAmount: totalFee,
      },
    });

    await prisma.bookingRequest.update({
      where: { id: bookingRequest.id },
      data: { status: BookingRequestStatus.COMPLETE },
    });

    await prisma.parkingSlot.update({
      where: { id: bookingRequest.slotId! },
      data: { status: "AVAILABLE" },
    });

    // Create Bill
    const bill = await billsService.createBill({ parkingSessionId: updatedSession.id });

    // Send email to user
    const user = await prisma.user.findUnique({ where: { id: vehicle.ownerId } });
    if (user?.email) {
      const subject = `Your Parking Receipt - ₭${bill.amount}`;
      const html = `
        <h2>Parking Bill</h2>
        <p><strong>Vehicle:</strong> ${vehicle.plateNumber}</p>
        <p><strong>Entry Time:</strong> ${entryTime.toLocaleString()}</p>
        <p><strong>Exit Time:</strong> ${now.toLocaleString()}</p>
        <p><strong>Duration:</strong> ${durationHours} hour(s)</p>
        <p><strong>Rate per Hour:</strong> ${feePerHour} RWF</p>
        <p><strong>Total Charged:</strong> ${totalFee} RWF</p>
        <hr />
        <p>Thank you for parking with us.</p>
      `;

      try {
        await mailUtil.sendEmail(user.email, subject, html);
      } catch (error: any) {
        logger.warn(`Failed to send receipt email to ${user.email}: ${error.message}`);
      }
    }

    await logsService.createLog({
      userId: user?.id!,
      action: `Bill with amount [${bill.amount}] created for user with email: [${user?.email}]`,
      status: LogStatus.SUCCESS,
    });

    return {
      message: "Parking session successfully ended and bill issued.",
    };
  };
}

export default new ParkingSessionService();
