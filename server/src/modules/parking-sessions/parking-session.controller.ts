import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import parkingSessionService from "./parking-session.service";
import { ApiResponse } from "../../common/payload/ApiResponse";

class ParkingSessionController {
  recordEntry = catchAsync(async (req, res) => {
    await parkingSessionService.recordEntry(req.body.vehicleId);
    return res.json(ApiResponse.success({ code: StatusCodes.OK, message: "Vehicle entry has been recorded" }));
  });
  
  getParkingSessions = catchAsync(async (req, res) => {
    const sessions = await parkingSessionService.getParkingSessions();
    return res.json(ApiResponse.success({ code: StatusCodes.OK, message: "Parking sessions retrieved", data: sessions }));
  });
  recordExit = catchAsync(async (req, res) => {
    await parkingSessionService.recordExit(req.body.vehicleId);
    return res.json(ApiResponse.success({ code: StatusCodes.OK, message: "Vehicle exit has been recorded" }));
  });
}

export default new ParkingSessionController();
