import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedError extends AppError {
  constructor(message = "Not authorized to perform action") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
