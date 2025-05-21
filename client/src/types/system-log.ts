import type { User } from "./user";

export interface SystemLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  status: "SUCCESS" | "FAILURE";
  user: User;
}
