import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class AccessDeniedError extends AppError {
  constructor(message = "No access") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
