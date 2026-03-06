import { Platform } from "react-native";
import { api } from "../api/api";
import { AuthResponse, LoginPayload, RegisterPayload } from "../types/auth";
import { User } from "../types/user";
import { MOBILE_APP_URL } from "../utils/config";

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
      password_confirmation: data.password_confirmation,
      course: data.course,
      year_level: data.year,
      mobile_app_url: MOBILE_APP_URL,
    };

    const response = await api.post<{ message: string }>("/signup", payload);
    console.log("Registration Response:", response.data, MOBILE_APP_URL);
    return response.data;
  },

  logout: async () => {
    await api.post("/logout");
  },

  getUser: async () => {
    const response = await api.get<User>("/user");
    return response.data;
  },

  sendResetCode: async (email: string) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  },

  verifyResetCode: async (email: string, code: string) => {
    const response = await api.post("/verify-reset-code", { email, code });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await api.post("/reset-password", {
      email: data.email,
      code: data.code,
      password: data.password,
      password_confirmation: data.password_confirmation,
    });
    return response.data;
  },
};
