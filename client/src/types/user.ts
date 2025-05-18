export interface User {
  id: String;
  email: String;
  firstName: String;
  lastName: String;
  isVerified: Boolean;
  role: "ADMIN" | "USER";
}
