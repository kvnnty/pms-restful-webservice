import { StatusCodes } from "http-status-codes";
import { AppException } from "./app.exception";

export class InternalServerErrorException extends AppException {
  constructor(message = "Something went wrong performing action") {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
