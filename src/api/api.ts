import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { TOKEN_KEY, API_URL } from "@/src/utils/config";

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("API 401: Token invalid or expired. Auto-logging out.");
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      
      onUnauthorizedCallback();
    }
    return Promise.reject(error);
  }
);