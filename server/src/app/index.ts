import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { errorMiddleware } from "../middleware/error.middleware";
import { requestLogger } from "../middleware/requestlogger.middleware";
import { allowedCorsOrigins } from "../utils/corsorigins.util";
import { routes } from "./routes";

const app = express();

app.use(cors({ origin: allowedCorsOrigins }));

app.use(helmet());

app.use(requestLogger);
app.use(cookieParser());

app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json());

app.use("/api/v1/", routes);

app.use(errorMiddleware);

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    status: "error",
    code: StatusCodes.NOT_FOUND,
    path: req.originalUrl,
    method: req.method,
    message: "The requested endpoint does not exist",
  });
});

export default app;
