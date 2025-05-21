import { MAIL_PASSWORD, MAIL_USERNAME } from "./env.config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD,
  },
});

export default transporter;
