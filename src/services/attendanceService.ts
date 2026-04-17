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
    const response = await api.get<AttendanceSession>(
      `/attendance-sessions/${id}`,
    );
    return response.data;
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

  getSessionAttendances: async (sessionId: number) => {
    const response = await api.get<Attendance[]>(
      `/attendance-sessions/${sessionId}/attendances`,
    );
    return response.data;
  },

  updateUserStatus: async (
    sessionId: number,
    userId: number,
    status: AttendanceStatus,
  ) => {
    const response = await api.patch(
      `/attendance-sessions/${sessionId}/members/${userId}`,
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
