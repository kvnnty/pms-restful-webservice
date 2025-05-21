import bcrypt from "bcrypt";
import { prisma } from "../../prisma/client";
import { CreateUserDto } from "../auth/auth.dto";
import logsService from "../system-logs/system-logs.service";
import { UpdateUserDto } from "./user.dto";
import { LogStatus } from "@prisma/client";

class UserService {
  async createUser(data: CreateUserDto) {
    return prisma.user.create({ data });
  }

  async registerParkingAttendant(data: CreateUserDto) {
    const { password, ...cleanedUserData } = data;
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        ...cleanedUserData,
        password: hashedPassword,
        role: "PARKING_ATTENDANT",
      },
    });

    await logsService.createLog({
      userId: user?.id!,
      action: `New user has registered with email: [${user?.email}]`,
      status: LogStatus.SUCCESS,
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
