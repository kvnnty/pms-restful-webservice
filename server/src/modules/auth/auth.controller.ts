import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import authService from "./auth.service";
import { loginDto } from "./auth.dto";

export class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const data = loginDto.parse(req.body);
    const tokens = await authService.login(data);
    const response = ApiResponse.success({ code: 200, message: "Logged in", data: tokens });
    res.status(StatusCodes.OK).json(response);
  });
}

export default new AuthController();
