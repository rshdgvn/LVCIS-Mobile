import { api } from "@/src/api/api";
import { Club, ClubPayload } from "@/src/types/club";

export const clubService = {
  getAllClubs: async (category?: string) => {
    const params = category ? { category } : {};
    const response = await api.get<Club[]>("/clubs", { params });
    return response.data;
  },

  getClubById: async (id: number) => {
    const response = await api.get<Club>(`/clubs/${id}`);
    return response.data;
  },

  createClub: async (data: ClubPayload) => {
    const response = await api.post<{ message: string; club: Club }>(
      "/clubs",
      data,
    );
    return response.data.club;
  },

  updateClub: async (id: number, data: ClubPayload | FormData) => {
    const response = await api.put<{ message: string; club: Club }>(
      `/clubs/${id}`,
      data,
      {
        headers: {
          "Content-Type":
            data instanceof FormData
              ? "multipart/form-data"
              : "application/json",
        },
      },
    );
    console.log("test", response.data.club);
    return response.data.club;
  },

  deleteClub: async (id: number) => {
    const response = await api.delete<{ message: string }>(`/clubs/${id}`);
    return response.data;
  },

  getMyClubs: async () => {
    const response = await api.get<Club[]>("/your/clubs");
    return response.data;
  },

  getOtherClubs: async () => {
    const response = await api.get<Club[]>("/other/clubs");
    return response.data;
  },

  getMyPendingClubs: async () =>
    (await api.get<Club[]>("/your/pending-clubs")).data,
};
