import { RequestHandler } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../exceptions/validation.exception";

class ValidationMiddleware {
  validate = (schema: ZodSchema): RequestHandler => {
    return (req, res, next) => {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return next(new ValidationError(result.error.errors[0].message));
      }
      req.body = result.data;
      next();
    };
  };
}

export default new ValidationMiddleware();
