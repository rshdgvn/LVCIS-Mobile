import { api } from "@/src/api/api";

export interface TaskMember {
  id: number;
  user_id: number;
  club_id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
}

export interface AssignedUser {
  name: string;
  avatar: string | null;
}

export interface EventTask {
  id: number;
  title: string;
  status: "pending" | "in_progress" | "completed";
  due_date: string | null;
  assigned_by: AssignedUser[];
}

export const taskService = {
  getTasksByEvent: async (
    eventId: number,
  ): Promise<{ tasks: EventTask[]; members: TaskMember[] }> => {
    const response = await api.get(`/events/${eventId}/tasks`);
    console.log("Fetched tasks response:", response.data);
    return response.data;
  },

  createTask: async (data: {
    event_id: number;
    title: string;
    status: string;
    assigned_members?: number[];
  }): Promise<EventTask> => {
    const response = await api.post("/create/task", data);
    console.log("Created task response:", response.data);
    return response.data;
  },

  updateTask: async (
    id: number,
    data: {
      title?: string;
      status?: string;
      assigned_members?: number[];
    },
  ): Promise<EventTask> => {
    const response = await api.patch(`/task/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (
    id: number,
    status: "pending" | "in_progress" | "completed",
  ): Promise<EventTask> => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/delete/task/${id}`);
  },
};
