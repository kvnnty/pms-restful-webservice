import { prisma } from "../prisma/client";

class ParkingUtil {
  parkingPrefix = "PAR";
  generateParkingCode = async () => {
    let code = `${this.parkingPrefix}${Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")}`;

    while (await prisma.parking.findUnique({ where: { code } })) {
      const randomNumber = Math.floor(Math.random() * 1000000);
      code = `${this.parkingPrefix}${randomNumber.toString().padStart(6, "0")}`;
    }

    return code;
  };
}

export default new ParkingUtil();
