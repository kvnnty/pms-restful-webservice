import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class AccessDeniedException extends AppException {
  constructor(message = "No access") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
