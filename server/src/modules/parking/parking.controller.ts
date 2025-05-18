import { Request, Response } from "express";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import { parkingService } from "./parking.service";
import { StatusCodes } from "http-status-codes";
import parkingSlotService from "../parking-slots/parking-slot.service";
import { Role } from "@prisma/client";

class ParkingController {
  create = catchAsync(async (req: Request, res: Response) => {
    const parking = await parkingService.create(req.body);
    return res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Created", data: parking }));
  });

  findAll = catchAsync(async (req: Request, res: Response) => {
    const parkings = await parkingService.findAll();
    return res.json(ApiResponse.success({ code: StatusCodes.OK, data: parkings }));
  });

  findOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parking = await parkingService.findById(id);
    return res.json(ApiResponse.success({ code: StatusCodes.OK, data: parking }));
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await parkingService.update(id, req.body);
    return res.json(ApiResponse.success({ code: StatusCodes.OK, message: "Updated", data: updated }));
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await parkingService.delete(id);
    return res.status(204).send();
  });

  listSlots = catchAsync(async (req: Request, res: Response) => {
    const isAdmin = (req as any).user.role === Role.ADMIN;
    const { page, limit, search } = req.query;
    const { id } = req.params;

    const result = await parkingSlotService.listSlots({
      parkingId: id,
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
      search: search ? String(search) : "",
      isAdmin,
    });

    return res.status(StatusCodes.OK).json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "Slots fetched",
        data: result,
      })
    );
  });
}

export default new ParkingController();
