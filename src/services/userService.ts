import { api } from "../api/api";

export const userService = {
  updateProfile: async (formData: FormData) => {
    // Laravel Method Spoofing: send as POST, but treat as PATCH
    formData.append("_method", "PATCH");

    const { data } = await api.post("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};