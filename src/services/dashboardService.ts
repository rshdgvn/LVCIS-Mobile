import { api } from "@/src/api/api";
import * as T from "@/src/types/dashboard";

export const dashboardService = {
  getClubsOverview: async () => {
    try {
      const response = await api.get<T.ClubsOverviewData>(
        "/dashboard/admin/clubs-overview",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getEngagementOverview: async () => {
    try {
      const response = await api.get<T.EngagementOverviewData>(
        "/dashboard/admin/engagement",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAttendanceTrend: async () => {
    try {
      const response = await api.get<T.AttendanceTrendData[]>(
        "/dashboard/admin/attendance-trend",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdditionalStats: async () => {
    try {
      const response = await api.get<T.AdditionalStatsData>(
        "/dashboard/admin/additional-stats",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getManagerStats: async (clubId: number) => {
    try {
      const response = await api.get<T.ManagerStats>(
        `/clubs/${clubId}/manager/stats`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getManagerInsights: async (clubId: number) => {
    try {
      const response = await api.get<T.ManagerInsights>(
        `/clubs/${clubId}/manager/insights`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getManagerTrend: async (clubId: number) => {
    try {
      const response = await api.get<T.AttendanceTrendItem[]>(
        `/clubs/${clubId}/manager/attendance-trend`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberOverview: async (clubId: number) => {
    try {
      const response = await api.get<T.MemberOverview>(
        `/clubs/${clubId}/member/overview`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberTasks: async (clubId: number) => {
    try {
      const response = await api.get<T.MemberTask[]>(
        `/clubs/${clubId}/member/tasks`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMemberEvents: async (clubId: number) => {
    try {
      const response = await api.get<T.UpcomingEvent[]>(
        `/clubs/${clubId}/member/upcoming-events`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
