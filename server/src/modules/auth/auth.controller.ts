import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import authService from "./auth.service";

export class AuthController {
  login = catchAsync(async (req: Request, res: Response) => {
    const { token, user } = await authService.login(req.body);
    const response = ApiResponse.success({ code: 200, message: "Logged in", data: { token, user } });
    res.status(StatusCodes.OK).json(response);
  });
  createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.createUser(req.body);
    res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "User created successfully", data: user }));
  });
}

export default new AuthController();
