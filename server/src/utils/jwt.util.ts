import Jwt from "jsonwebtoken";
import { User } from "../prisma/schema/generated/prisma";
import { JWT_SECRET_KEY } from "../config/env.config";
import { JwtVerificationError } from "../exceptions/jwt-verification.error";

class JwtUtil {
  generateJwtToken = (payload: User) => {
    try {
      const { id, email, role } = payload;
      return Jwt.sign({ id, email, role }, JWT_SECRET_KEY, { expiresIn: "2d" });
    } catch (e: any) {
      throw new JwtVerificationError();
    }
  };

  validateJwtToken = (token: string) => {
    try {
      return Jwt.verify(token, JWT_SECRET_KEY) as Jwt.JwtPayload;
    } catch (e: any) {
      throw new JwtVerificationError();
    }
  };
}

export default new JwtUtil();
