import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class DuplicateResourceException extends AppException {
  constructor(message = "Resource already exists") {
    super(message, StatusCodes.CONFLICT);
  }
}
