import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
