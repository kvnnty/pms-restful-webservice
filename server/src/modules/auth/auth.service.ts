import bcrypt from "bcrypt";
import jwtUtil from "../../utils/jwt.util";
import { CreateUserDto, LoginUserDto } from "./auth.dto";
import { DuplicateResourceException } from "../../exceptions/duplicate-resource.exception";
import userService from "../users/user.service";
import { BadCredentialsException } from "../../exceptions/bad-credentials.exception";

export class AuthService {
  async login(data: LoginUserDto) {
    const user = await userService.findUserByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new BadCredentialsException("Invalid email or password.");
    }
    const { password, ...cleanedUserData } = user;
    const token = jwtUtil.generateJwtToken(user);
    return {
      token,
      user: cleanedUserData,
    };
  }
  async createUser(data: CreateUserDto) {
    const existing = await userService.findUserByEmail(data.email);
    if (existing) throw new DuplicateResourceException("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return userService.createUser({ ...data, password: hashedPassword });
  }
}

export default new AuthService();
