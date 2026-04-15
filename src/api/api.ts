import { API_URL, TOKEN_KEY } from "@/src/utils/config";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let onUnauthorizedCallback: () => void = () => {};

export const setUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isHandling401 = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authEndpoints = [
      "/login",
      "/signup",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/verify",
      "/email",
      "/logout",
    ];

    const isAuthRoute = authEndpoints.some((endpoint) =>
      error.config?.url?.includes(endpoint),
    );

    if (error.response?.status === 401 && !isAuthRoute) {
      console.warn("API 401: Token invalid or expired. Auto-logging out.");

      if (!isHandling401) {
        isHandling401 = true;
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        onUnauthorizedCallback();

        setTimeout(() => {
          isHandling401 = false;
        }, 2000);
      }
    }

    return Promise.reject(error);
  },
);
