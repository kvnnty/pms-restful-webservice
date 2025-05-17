import bcrypt from "bcrypt";
import jwtUtil from "../../utils/jwt.util";
import userRepository from "../users/user.repository";
import { LoginUserDto } from "./auth.dto";

export class AuthService {
  async login(data: LoginUserDto) {
    const user = await userRepository.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new Error("Invalid email or password.");
    }
    const token = jwtUtil.generateJwtToken(user);
    return { token };
  }
}

export default new AuthService();
