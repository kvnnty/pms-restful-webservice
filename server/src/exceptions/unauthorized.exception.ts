import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class UnauthorizedException extends AppException {
  constructor(message = "Not authorized to perform action") {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
