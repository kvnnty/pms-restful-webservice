import { User } from "@prisma/client";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import userService from "./user.service";

class UserController {
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(StatusCodes.OK).json(ApiResponse.success({ code: StatusCodes.OK, message: "Users fetched successfully", data: users }));
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const updated = await userService.updateUser(user.id, req.body);
    res.status(StatusCodes.OK).json(ApiResponse.success({ code: StatusCodes.OK, message: "Profile updated successfully", data: updated }));
    res.json(updated);
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const currentUser = await userService.findUserById(user.id);
    const response = ApiResponse.success({ code: StatusCodes.OK, message: "User profile", data: currentUser });
    res.status(StatusCodes.OK).json(response);
  });
  
  registerParkingAttendant = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.registerParkingAttendant(req.body);
    res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Parking lot attendant created successfully", data: user }));
  });
}

export default new UserController();
