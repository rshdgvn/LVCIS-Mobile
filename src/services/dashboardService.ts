import { api } from "@/src/api/api";
import {
  AdditionalStatsData,
  AttendanceTrendData,
  ClubsOverviewData,
  EngagementOverviewData,
} from "../types/dashboard";

export const dashboardService = {
  getClubsOverview: async () => {
    try {
      console.log("📡 [API] Fetching Clubs Overview...");
      const response = await api.get<ClubsOverviewData>(
        "/dashboard/admin/clubs-overview",
      );
      console.log(
        "🟢 [API] Clubs Overview Response:",
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "🔴 [API] Clubs Overview Failed:",
        error?.response?.status,
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  getEngagementOverview: async () => {
    try {
      console.log("📡 [API] Fetching Engagement Overview...");
      const response = await api.get<EngagementOverviewData>(
        "/dashboard/admin/engagement",
      );
      console.log(
        "🟢 [API] Engagement Overview Response:",
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "🔴 [API] Engagement Overview Failed:",
        error?.response?.status,
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  getAttendanceTrend: async () => {
    try {
      console.log("📡 [API] Fetching Attendance Trend...");
      const response = await api.get<AttendanceTrendData[]>(
        "/dashboard/admin/attendance-trend",
      );
      console.log(
        "🟢 [API] Attendance Trend Response:",
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "🔴 [API] Attendance Trend Failed:",
        error?.response?.status,
        error?.response?.data || error.message,
      );
      throw error;
    }
  },

  getAdditionalStats: async () => {
    try {
      console.log("📡 [API] Fetching Additional Stats...");
      const response = await api.get<AdditionalStatsData>(
        "/dashboard/admin/additional-stats",
      );
      console.log(
        "🟢 [API] Additional Stats Response:",
        JSON.stringify(response.data, null, 2),
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "🔴 [API] Additional Stats Failed:",
        error?.response?.status,
        error?.response?.data || error.message,
      );
      throw error;
    }
  },
};
