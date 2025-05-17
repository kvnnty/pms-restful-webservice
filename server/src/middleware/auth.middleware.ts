import { NextFunction, Request, Response } from "express";
import { AccessDeniedError } from "../exceptions/access-denied.error";
import { BadRequestError } from "../exceptions/bad-request.error";
import { JwtVerificationError } from "../exceptions/jwt-verification.error";
import { UnauthorizedError } from "../exceptions/unauthorized.error";
import { prisma } from "../prisma/client";
import { Role, User } from "../prisma/schema/generated/prisma";
import jwtUtil from "../utils/jwt.util";

interface AuthenticatedRequest extends Request {
  user?: User;
}

class AuthMiddleware {
  async requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const jwtToken = req.headers.authorization?.split(" ")[1];
      if (!jwtToken) {
        throw new UnauthorizedError("Authentication is required to access this resource");
      }

      const decoded = jwtUtil.validateJwtToken(jwtToken);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        throw new BadRequestError("User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  async requireAdminRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required to access this resource");
    }

    if (req.user.role !== Role.ADMIN) {
      throw new AccessDeniedError("Access denied. You don't have the permission to access this resource");
    }

    next();
  }
}

export default new AuthMiddleware();
