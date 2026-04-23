import { api } from "@/src/api/api";
import { Event } from "@/src/types/event";

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get("/events");
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  addEvent: async (formData: FormData) => {
    const response = await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  updateEvent: async ({ id, data }: { id: number; data: FormData }) => {
    data.append("_method", "PATCH");
    const response = await api.post(`/events/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteEvent: async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};
