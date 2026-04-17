import { api } from "@/src/api/api";
import {
  Attendance,
  AttendanceSession,
  AttendanceStats,
  AttendanceStatus,
  SessionPayload,
} from "../types/attendance";

export const attendanceService = {
  getSessions: async (clubId: number) => {
    const response = await api.get<any>("/attendance-sessions", {
      params: { club_id: clubId },
    });
    return response.data?.sessions || [];
  },

  createSession: async (data: SessionPayload) => {
    const response = await api.post<{
      message: string;
      session: AttendanceSession;
    }>("/attendance-sessions", data);
    return response.data.session;
  },

  getSession: async (id: number) => {
    try {
      console.log(`[Service] Making API request for session ID: ${id}`);
      const response = await api.get<AttendanceSession>(
        `/attendance-sessions/${id}`,
      );
      console.log("[Service] Success! Fetched single session:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "[Service] Error fetching single session:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  getSessionAttendances: async (sessionId: number) => {
    try {
      console.log(
        `[Service] Making API request for attendances of session ID: ${sessionId}`,
      );
      const response = await api.get<Attendance[]>(
        `/attendance-sessions/${sessionId}/attendance`,
      );
      console.log("[Service] Success! Fetched attendances:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "[Service] Error fetching attendances:",
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  updateSession: async (id: number, data: Partial<SessionPayload>) => {
    const response = await api.put<{
      message: string;
      session: AttendanceSession;
    }>(`/attendance-sessions/${id}`, data);
    return response.data.session;
  },

  deleteSession: async (id: number) => {
    const response = await api.delete<{ message: string; error?: string }>(
      `/attendance-sessions/${id}`,
    );
    return response.data;
  },

  // getSessionAttendances: async (sessionId: number) => {
  //   const response = await api.get<Attendance[]>(
  //     `/attendance-sessions/${sessionId}/attendance`,
  //   );
  //   console.log("Fetched attendances for session:", response.data);
  //   return response.data;
  // },

  updateUserStatus: async (
    sessionId: number,
    userId: number,
    status: AttendanceStatus,
  ) => {
    const response = await api.put(
      `/attendance-sessions/${sessionId}/users/${userId}/status`,
      { status },
    );
    return response.data;
  },

  getMemberAttendance: async (userId: number, clubId: number) => {
    const response = await api.get<{
      attendances: Attendance[];
      stats: AttendanceStats;
      user: any;
    }>(`/users/${userId}/clubs/${clubId}/attendances`);
    return response.data;
  },
};
