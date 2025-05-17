import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class ValidationError extends AppException {
  constructor(message = "Invalid input") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
