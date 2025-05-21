import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../common/handlers/catchAsync";
import { ApiResponse } from "../../common/payload/ApiResponse";
import bookingRequestService from "./booking-request.service";

class BookingRequestController {
  create = catchAsync(async (req, res) => {
    const userId = (req as any).user.id;
    const result = await bookingRequestService.createRequest({ userId, data: req.body });
    res.status(StatusCodes.CREATED).json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Request created", data: result }));
  });

  update = catchAsync(async (req, res) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const result = await bookingRequestService.updateRequest({ userId, bookingRequestId: id, data: req.body });
    res.json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Request updated", data: result }));
  });

  delete = catchAsync(async (req, res) => {
    const userId = (req as any).user.id;
    const { id } = req.params;
    await bookingRequestService.deleteRequest({ userId, bookingRequestId: id });
    res.status(StatusCodes.NO_CONTENT).send();
  });

  decide = catchAsync(async (req, res) => {
    const { id } = req.params;
    await bookingRequestService.decideRequest({ bookingRequestId: id, decision: req.body });
    res.json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Decision applied" }));
  });

  list = catchAsync(async (req, res) => {
    const role = (req as any).user.role;
    const userId = (req as any).user.id;
    const result = await bookingRequestService.listRequests(userId, role, req.query);
    res.json(ApiResponse.success({ code: StatusCodes.CREATED, message: "Requests fetched", data: result }));
  });

  getBySlotId = catchAsync(async (req, res) => {
    const { slotId } = req.params;
    const requests = await bookingRequestService.getBySlotId(slotId);
    res.json(ApiResponse.success({ message: "Requests fetched", data: requests }));
  });

  getUserBookingRequests = catchAsync(async (req, res) => {
    const user = (req as any).user;
    const requests = await bookingRequestService.getUserBookingRequests(user.id);
    res.json(ApiResponse.success({ message: "User bookings retrieved", data: requests }));
  });
}

export default new BookingRequestController();
