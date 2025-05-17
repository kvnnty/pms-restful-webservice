import { AppError } from "./app.error";
import { StatusCodes } from "http-status-codes";

export class BadCredentials extends AppError {
  constructor(message = "Bad credentials") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
