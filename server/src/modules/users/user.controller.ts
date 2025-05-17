import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import { User } from "../../prisma/schema/generated/prisma";
import { createUserDto, updateUserDto } from "./user.dto";
import userService from "./user.service";

class UserController {
  createUser = catchAsync(async (req: Request, res: Response) => {
    const data = createUserDto.parse(req.body);
    const user = await userService.createUser(data);
    res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "User created successfully", data: user }));
  });

  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(StatusCodes.OK).json(ApiResponse.success({ code: StatusCodes.OK, message: "Users fetched successfully", data: users }));
  });

  updateUser = catchAsync(async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const data = updateUserDto.parse(req.body);
    const updated = await userService.updateUser(user.id, data);
    res.status(StatusCodes.OK).json(ApiResponse.success({ code: StatusCodes.OK, message: "User updated successfully", data: updated }));
    res.json(updated);
  });

  deleteUser = catchAsync(async (req: Request, res: Response) => {
    await userService.deleteUser(req.params.id);
    res.status(204).send();
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    const user: User = (req as any).user;
    const currentUser = await userService.getUserById(user.id);
    const response = ApiResponse.success({ code: StatusCodes.OK, message: "User profile", data: currentUser });
    res.status(StatusCodes.OK).json(response);
  });
}

export default new UserController();
