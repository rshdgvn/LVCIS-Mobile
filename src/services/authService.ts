import { Platform } from "react-native";
import { api } from "../api/api";
import { AuthResponse, LoginPayload, User } from "../types/auth";

export const authService = {
  login: async (data: LoginPayload) => {
    const payload = {
      ...data,
      device_name: Platform.OS === "ios" ? "ios" : "android",
    };
    const response = await api.post<AuthResponse>("/login", payload);
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
