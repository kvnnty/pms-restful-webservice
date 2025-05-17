import { AppException } from "./app.exception";
import { StatusCodes } from "http-status-codes";

export class BadRequestException extends AppException {
  constructor(message = "Bad request") {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
