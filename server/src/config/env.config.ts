import { config } from "dotenv";

config();

export const PORT = process.env.PORT! || 7654;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
export const NODE_ENV = process.env.NODE_ENV! as "development" | "production";

export const MAIL_USERNAME = process.env.MAIL_USERNAME!;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD!;
