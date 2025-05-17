import { prisma } from "../../prisma/client";
import { CreateUserDto, UpdateUserDto } from "./user.dto";

export class UserRepository {
  async create(data: CreateUserDto) {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return prisma.user.findMany();
  }

  async update(id: string, data: UpdateUserDto) {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  async findById(id: string) {
    return prisma.user.findFirst({
      where: { id },
    });
  }
}

export default new UserRepository();
