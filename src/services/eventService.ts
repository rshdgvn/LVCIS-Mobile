import { api } from "@/src/api/api";
import { Event } from "@/src/types/event";

export const eventService = {
  // Get all events with their details and club info
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get("/events");
    return response.data;
  },

  // Get a specific event
  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Add a new event
  // Note: This uses FormData because your controller handles file uploads
  addEvent: async (formData: FormData) => {
    const response = await api.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update an existing event
updateEvent: async ({ id, data }: { id: number, data: FormData }) => {
    data.append("_method", "PATCH"); 

    return await api.post(`/events/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
    // Delete an event
    deleteEvent: async (id: number) => {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    },
  };