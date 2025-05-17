import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { ApiResponse } from "../common/payload/ApiResponse";
import { AppException } from "../exceptions/app.exception";
import logger from "../utils/logger.util";

export const errorMiddleware: ErrorRequestHandler = (err, req, res, next): void => {
  logger.error(err.message);

  if (err instanceof ZodError) {
    res.status(400).json(ApiResponse.fail({ code: 400, message: err.errors[0].message }));
    return;
  }

  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json(ApiResponse.fail({ code: 400, message: "Invalid JSON request" }));
    return;
  }

  if (err instanceof PrismaClientKnownRequestError) {
    res.status(400).json(ApiResponse.fail({ code: 400, message: "Database error", error: err.message }));
    return;
  }

  if (err instanceof AppException) {
    res.status(err.statusCode || 400).json(ApiResponse.fail({ code: err.statusCode || 400, message: err.message }));
    return;
  }

  res.status(err.statusCode || 500).json(
    ApiResponse.error({
      code: err.statusCode || 500,
      message: err.message || "Internal Server Error",
    })
  );
  return;
};
