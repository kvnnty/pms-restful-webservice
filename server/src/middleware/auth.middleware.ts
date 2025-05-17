import { Role, User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { AccessDeniedException } from "../exceptions/access-denied.exception";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { prisma } from "../prisma/client";
import jwtUtil from "../utils/jwt.util";

interface AuthenticatedRequest extends Request {
  user?: User;
}

class AuthMiddleware {
  async requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const jwtToken = req.headers.authorization?.split(" ")[1];
      if (!jwtToken) {
        throw new UnauthorizedException("Authentication is required to access this resource");
      }

      const decoded = jwtUtil.validateJwtToken(jwtToken);
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });

      if (!user) {
        throw new BadRequestException("User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  async requireAdminRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new UnauthorizedException("Authentication required to access this resource");
    }

    if (req.user.role !== Role.ADMIN) {
      throw new AccessDeniedException("Access denied. You don't have the permission to access this resource");
    }

    next();
  }
}

export default new AuthMiddleware();
