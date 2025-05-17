import bcrypt from "bcrypt";
import { DuplicateResourceError } from "../../exceptions/duplicate-resource.error";
import { CreateUserDto, UpdateUserDto } from "./user.dto";
import userRepository from "./user.repository";

class UserService {
  async createUser(data: CreateUserDto) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new DuplicateResourceError("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return userRepository.create({ ...data, password: hashedPassword });
  }

  async getAllUsers() {
    return userRepository.findAll();
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return userRepository.update(id, data);
  }

  async deleteUser(id: string) {
    return userRepository.delete(id);
  }

  async getUserById(id: string) {
    return userRepository.findById(id);
  }
}

export default new UserService();
