import { StatusCodes } from "http-status-codes";
import { AppError } from "./app.error";

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}
