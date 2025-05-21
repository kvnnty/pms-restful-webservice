import { Request, Response } from "express";
import logsService from "./system-logs.service";

class SytemLogsController {
  async getLogs(req: Request, res: Response) {
    try {
      const logs = await logsService.getAllLogs();
      res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      console.error("Error fetching logs:", error);
      res.status(500).json({ success: false, message: "Failed to fetch logs" });
    }
  }
}

export default new SytemLogsController();
