import { prisma } from "../prisma/client";

class ParkingSlotUtil {
  async generateSlotNumber(locationPrefix: string): Promise<string> {
    const existing = await prisma.parkingSlot.findMany({
      where: {
        slotNumber: {
          startsWith: locationPrefix,
        },
      },
      select: {
        slotNumber: true,
      },
    });

    const usedNumbers = new Set(
      existing
        .map((s) => s.slotNumber.match(/(\d+)$/)?.[1])
        .filter(Boolean)
        .map(Number)
    );

    const next = Math.max(...Array.from(usedNumbers), 0) + 1;
    const padded = String(next).padStart(3, "0");
    return `${locationPrefix}-${padded}`;
  }

  async generateMultipleSlotNumbers(locationPrefix: string, count: number): Promise<string[]> {
    const existing = await prisma.parkingSlot.findMany({
      where: {
        slotNumber: {
          startsWith: locationPrefix,
        },
      },
      select: {
        slotNumber: true,
      },
    });

    const usedNumbers = new Set(
      existing
        .map((s) => s.slotNumber.match(/(\d+)$/)?.[1])
        .filter(Boolean)
        .map(Number)
    );

    let counter = Math.max(...Array.from(usedNumbers), 0) + 1;

    const slotNumbers: string[] = [];
    for (let i = 0; i < count; i++) {
      const padded = String(counter++).padStart(3, "0");
      slotNumbers.push(`${locationPrefix}-${padded}`);
    }

    return slotNumbers;
  }
}

export default new ParkingSlotUtil();
