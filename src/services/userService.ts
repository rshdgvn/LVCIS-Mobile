import { api } from "../api/api";

export const userService = {
  getUserProfile: async () => {
    const response = await api.get("/user/profile");
    return {
      ...response.data.user,
      member: response.data.member,
    };
  },

  updateProfile: async (formData: FormData) => {
    formData.append("_method", "PATCH");

    const { data } = await api.post("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  changePassword: async (data: any) => {
    const response = await api.post("/user/change-password", data);
    return response.data;
  },
};
