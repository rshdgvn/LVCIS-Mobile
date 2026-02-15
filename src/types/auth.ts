export interface LoginPayload {
  email: string;
  password: string;
  device_name?: string; // Laravel Sanctum needs this
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  course: string;
  year: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: RegisterPayload) => Promise<void>;
}
