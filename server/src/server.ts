import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { PORT } from "./config/env.config";
import { prisma } from "./prisma/client";
import logger from "./utils/logger.util";

dotenv.config();
const server = http.createServer(app);

async function startServer() {
  try {
    await prisma.$connect();
    logger.info("[DB] Connected to database.");

    server.listen(PORT, () => {
      logger.info(`[Server] Running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("[Fatal] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
