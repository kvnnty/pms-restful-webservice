import { LogStatus } from "@prisma/client";
import { prisma } from "../../prisma/client";

class SystemLogsService {
  async getAllLogs() {
    return await prisma.systemLog.findMany({
      include: { user: true },
      orderBy: { timestamp: "desc" },
    });
  }

  async createLog({ userId, action, status }: { userId: string; action: string; status: LogStatus }) {
    await prisma.systemLog.create({
      data: {
        userId,
        action,
        status,
      },
      include: {
        user: true,
      },
    });
  }
}

export default new SystemLogsService();
