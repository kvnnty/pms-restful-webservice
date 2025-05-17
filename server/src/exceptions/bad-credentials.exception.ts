import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class BadCredentialsException extends AppException {
  constructor(message = "Bad credentials") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
