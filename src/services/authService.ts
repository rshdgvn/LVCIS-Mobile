import { Platform } from "react-native";
import { api } from "../api/api";
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "../types/auth";

export const authService = {
  login: async (data: LoginPayload) => {
    const payload = {
      ...data,
      device_name: Platform.OS === "ios" ? "ios" : "android",
    };
    const response = await api.post<AuthResponse>("/login", payload);
    return response.data;
  },

  register: async (data: RegisterPayload) => {
    const payload = {
      first_name: data.firstname,
      last_name: data.lastname,
      email: data.email,
      password: data.password,
      course: data.course,
      year_level: data.year,
    };

    const response = await api.post<{ message: string }>("/signup", payload);
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
  },

  getUser: async () => {
    const response = await api.get<User>("/user");
    return response.data;
  },
};
