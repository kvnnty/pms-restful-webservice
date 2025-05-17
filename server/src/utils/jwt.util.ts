import Jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config/env.config";
import { JwtVerificationException } from "../exceptions/jwt-verification.exception";
import { User } from "@prisma/client";

class JwtUtil {
  generateJwtToken = (payload: User) => {
    try {
      const { id, email, role } = payload;
      return Jwt.sign({ id, email, role }, JWT_SECRET_KEY, { expiresIn: "2d" });
    } catch (e: any) {
      throw new JwtVerificationException();
    }
  };

  validateJwtToken = (token: string) => {
    try {
      return Jwt.verify(token, JWT_SECRET_KEY) as Jwt.JwtPayload;
    } catch (e: any) {
      throw new JwtVerificationException();
    }
  };
}

export default new JwtUtil();
