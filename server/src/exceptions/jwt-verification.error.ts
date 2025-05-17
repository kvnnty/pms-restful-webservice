import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class JwtVerificationError extends AppError {
  constructor(message = "Invalid or Expired JWT") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
