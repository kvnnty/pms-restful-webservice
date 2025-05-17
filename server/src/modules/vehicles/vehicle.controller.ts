import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import vehicleService from "./vehicle.service";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";

class VehicleController {
  createVehicle = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const vehicle = await vehicleService.createVehicle({ data: req.body, userId });
    res.status(StatusCodes.CREATED).json(
      ApiResponse.success({
        code: StatusCodes.CREATED,
        message: "Vehicle registered successfully",
        data: vehicle,
      })
    );
  });

  updateVehicle = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const updated = await vehicleService.updateVehicle({ userId, vehicleId: id, data: req.body });
    res.json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "Vehicle updated successfully",
        data: updated,
      })
    );
  });

  deleteVehicle = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = (req as any).user.id;
    await vehicleService.deleteVehicle({ userId, vehicleId: id });
    res.status(StatusCodes.NO_CONTENT).json(
      ApiResponse.success({
        code: StatusCodes.NO_CONTENT,
        message: "Vehicle deleted successfully",
      })
    );
  });

  getVehicleById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const vehicle = await vehicleService.getVehicleById(id);
    res.json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "Vehicle fetched successfully",
        data: vehicle,
      })
    );
  });

  getVehiclesByUser = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const vehicles = await vehicleService.getVehiclesByUser(userId);
    res.json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "User's vehicles fetched successfully",
        data: vehicles,
      })
    );
  });

  getAllVehicles = catchAsync(async (_req: Request, res: Response) => {
    const vehicles = await vehicleService.getAllVehicles();
    res.json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "All vehicles fetched successfully",
        data: vehicles,
      })
    );
  });
}

export default new VehicleController();
