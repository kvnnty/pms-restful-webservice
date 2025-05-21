import { prisma } from "../../prisma/client";
import { BadRequestException } from "../../exceptions/bad-request.exception";

class BillsService {
  async createBill({ parkingSessionId }: { parkingSessionId: string }) {
    const session = await prisma.parkingSession.findUnique({
      where: { id: parkingSessionId },
      include: { vehicle: true },
    });

    if (!session) throw new BadRequestException("Parking session not found");
    if (!session.isExited) throw new BadRequestException("Cannot bill for an active session");

    const bill = await prisma.bill.create({
      data: {
        parkingSessionId: session.id,
        userId: session.userId,
        vehicleId: session.vehicleId,
        amount: session.chargedAmount ?? 0,
      },
    });

    return bill;
  }

  async getBillsByUser(userId: string) {
    return await prisma.bill.findMany({
      where: { userId },
      include: {
        parkingSession: true,
        vehicle: true,
      },
    });
  }

  async getAllBills() {
    return await prisma.bill.findMany({
      include: {
        parkingSession: true,
        vehicle: true,
        user: true,
      },
    });
  }
}

export default new BillsService();
