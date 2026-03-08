export interface User {
  id: number;
  avatar: string | undefined;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "user";
}
