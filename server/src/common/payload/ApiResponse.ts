import { StatusCodes } from "http-status-codes";

type ApiResponseType<T> = {
  status: "success" | "fail" | "error";
  code: number;
  message: string;
  data?: T;
  error?: T;
  meta?: any;
};

export class ApiResponse {
  static success<T>({ code = 200, message = "Request successful", data, meta }: { code?: StatusCodes; message?: string; data?: T; meta?: any }): ApiResponseType<T> {
    return {
      status: "success",
      code,
      message,
      ...(data !== undefined && { data }),
      ...(meta && { meta }),
    };
  }

  static fail<T>({ code = 400, message = "Request failed", error }: { code: number; message: string; error?: T }): ApiResponseType<T> {
    return {
      status: "fail",
      code,
      message,
      ...(error !== undefined && { error }),
    };
  }

  static error({ code = 500, message = "Internal Server Error" }: { code: number; message: string }): ApiResponseType<null> {
    return {
      status: "error",
      code,
      message,
    };
  }
}
