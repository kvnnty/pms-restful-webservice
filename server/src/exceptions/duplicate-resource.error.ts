import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class DuplicateResourceError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, StatusCodes.CONFLICT);
  }
}
