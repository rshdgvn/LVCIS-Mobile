export interface User {
  id: number;
  avatar: string | undefined;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "user"
  member?: Member; 
}

export interface Member {
  course: string | null;
  year_level: string | null;
}
