import { api } from "@/src/api/api";
import { Event } from "@/src/types/event";

export const eventService = {
  getAllEvents: async (clubId?: number | null): Promise<Event[]> => {
    console.log("[eventService] getAllEvents | clubId:", clubId);
    const params: any = {};
    if (clubId) params.club_id = clubId;

    const response = await api.get("/events", { params });
    console.log("[eventService] getAllEvents | response:", response.data);
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    console.log("[eventService] getEventById | id:", id);
    const response = await api.get(`/events/${id}`);
    console.log("[eventService] getEventById | response:", response.data);
    return response.data;
  },

  addEvent: async (formData: FormData) => {
    console.log("[eventService] addEvent | formData entries:");
    formData.forEach((value, key) => console.log(`  ${key}:`, value));

    const response = await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("[eventService] addEvent | response:", response.data);
    return response.data;
  },

  updateEvent: async ({ id, data }: { id: number; data: FormData }) => {
    console.log("[eventService] updateEvent | id:", id);
    console.log("[eventService] updateEvent | formData entries:");
    data.forEach((value, key) => console.log(`  ${key}:`, value));

    try {
      const response = await api.patch(`/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(
        "[eventService] updateEvent | success | response:",
        response.data,
      );
      return response.data;
    } catch (error: any) {
      console.log(
        "[eventService] updateEvent | error status:",
        error?.response?.status,
      );
      console.log(
        "[eventService] updateEvent | error message:",
        error?.response?.data,
      );
      throw error;
    }
  },

  deleteEvent: async (id: number) => {
    console.log("[eventService] deleteEvent | id:", id);

    try {
      const response = await api.delete(`/events/${id}`);
      console.log(
        "[eventService] deleteEvent | success | response:",
        response.data,
      );
      return response.data;
    } catch (error: any) {
      console.log(
        "[eventService] deleteEvent | error status:",
        error?.response?.status,
      );
      console.log(
        "[eventService] deleteEvent | error message:",
        error?.response?.data,
      );
      throw error;
    }
  },
};
