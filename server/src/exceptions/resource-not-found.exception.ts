import { StatusCodes } from "http-status-codes";
import { AppException } from "./app.exception";

export class ResourceNotFoundException extends AppException {
  constructor(message = "Not found") {
    super(message, StatusCodes.NOT_FOUND);
  }
}
