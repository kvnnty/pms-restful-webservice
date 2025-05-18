import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import parkingSlotService from "./parking-slot.service";

class ParkingSlotController {
  createSlot = catchAsync(async (req, res) => {
    const slot = await parkingSlotService.createSlot(req.body);
    return res.status(StatusCodes.CREATED).json(
      ApiResponse.success({
        code: StatusCodes.CREATED,
        message: "Slot created",
        data: slot,
      })
    );
  });

  bulkCreateSlots = catchAsync(async (req, res) => {
    await parkingSlotService.bulkCreateSlots(req.body);
    return res.status(StatusCodes.CREATED).json(
      ApiResponse.success({
        code: StatusCodes.CREATED,
        message: `${req.body.count} Bulk slots created`,
      })
    );
  });

  listSlots = catchAsync(async (req, res) => {
    const isAdmin = (req as any).user.role === Role.ADMIN;
    const { page, limit, search } = req.query;
    const pageNum = page ? +page : 1;
    const limitNum = limit ? +limit : 10;
    const result = await parkingSlotService.listSlots({
      parkingId: req.params.parkingId,
      page: pageNum,
      limit: limitNum,
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

  updateSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedSlot = await parkingSlotService.updateSlot({ slotId: id, data: req.body });
    return res.status(StatusCodes.OK).json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "Slot updated successfully",
        data: updatedSlot,
      })
    );
  });

  deleteSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    await parkingSlotService.deleteSlot(id);
    return res.status(StatusCodes.NO_CONTENT).send();
  });

  getSlotById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const slot = await parkingSlotService.getSlotById(id);
    return res.status(StatusCodes.OK).json(
      ApiResponse.success({
        code: StatusCodes.OK,
        message: "Slot fetched",
        data: slot,
      })
    );
  });
}

export default new ParkingSlotController();
