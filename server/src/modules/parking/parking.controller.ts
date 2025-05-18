import { Request, Response } from "express";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import { parkingService } from "./parking.service";
import { StatusCodes } from "http-status-codes";

class ParkingController {
  create = catchAsync(async (req: Request, res: Response) => {
    const parking = await parkingService.create(req.body);
    res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Created", data: parking }));
  });

  findAll = catchAsync(async (req: Request, res: Response) => {
    const parkings = await parkingService.findAll();
    res.json(ApiResponse.success({ code: StatusCodes.OK, data: parkings }));
  });

  findOne = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const parking = await parkingService.findById(id);
    res.json(ApiResponse.success({ code: StatusCodes.OK, data: parking }));
  });

  update = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updated = await parkingService.update(id, req.body);
    res.json(ApiResponse.success({ code: StatusCodes.OK, message: "Updated", data: updated }));
  });

  delete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await parkingService.delete(id);
    res.status(204).send();
  });
}

export default new ParkingController();
