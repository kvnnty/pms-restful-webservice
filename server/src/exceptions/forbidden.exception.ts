import { StatusCodes } from "http-status-codes";
import { AppException } from "./app.exception";

export class ForbiddenException extends AppException {
  constructor(message = "Not allowed to perform this action") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
