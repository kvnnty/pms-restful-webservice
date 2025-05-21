import { prisma } from "../../prisma/client";
import { CreateUserDto } from "../auth/auth.dto";
import { UpdateUserDto } from "./user.dto";
import bcrypt from "bcrypt";

class UserService {
  async createUser(data: CreateUserDto) {
    return prisma.user.create({ data });
  }

  async registerParkingAttendant(data: CreateUserDto) {
    const { password, ...cleanedUserData } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        ...cleanedUserData,
        password: hashedPassword,
        role: "PARKING_ATTENDANT",
      },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany();
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return prisma.user.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async findUserById(id: string) {
    return prisma.user.findFirst({
      where: { id },
    });
  }

  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}

export default new UserService();
