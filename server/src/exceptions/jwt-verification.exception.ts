import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class JwtVerificationException extends AppException {
  constructor(message = "Invalid or Expired JWT") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
