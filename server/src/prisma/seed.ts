import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { ADMIN_EMAIL, ADMIN_FIRSTNAME, ADMIN_LASTNAME, ADMIN_PASSWORD } from "../config/env.config";

const prisma = new PrismaClient();

export const ensureAdminUser = async () => {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await prisma.user.create({
      data: {
        firstName: ADMIN_FIRSTNAME,
        lastName: ADMIN_LASTNAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: Role.ADMIN,
        isVerified: true,
      },
    });

    console.log(`✅ Admin user created: ${ADMIN_EMAIL}`);
  }
};
