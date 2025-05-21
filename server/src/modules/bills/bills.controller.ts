import { Request, Response } from "express";
import { catchAsync } from "../../common/handlers/catchAsync";
import BillsService from "./bills.service";

class BillsController {
  // create = catchAsync(async (req: Request, res: Response) => {
  //   const bill = await BillsService.createBill(req.body.parkingSessionId);
  //   res.status(201).json({ success: true, bill });
  // });

  getAll = catchAsync(async (_req: Request, res: Response) => {
    const bills = await BillsService.getAllBills();
    res.status(200).json({ success: true, data: bills });
  });

  getByUser = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const bills = await BillsService.getBillsByUser(userId);
    res.status(200).json({ success: true, data: bills });
  });
}

export default new BillsController();
