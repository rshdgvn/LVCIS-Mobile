import { api } from "../api/api";
import { MemberProfile, PendingApplicant } from "../types/club";

export const membershipService = {
  getCurrentUserMemberInfo: async () => {
    const response = await api.get<{ member: MemberProfile | null }>(
      "/user/member-info",
    );
    return response.data;
  },

  setupMemberProfile: async (data: { course: string; year_level: string }) => {
    const response = await api.post("/user/setup-profile", data);
    return response.data;
  },

  joinClub: async (
    clubId: number,
    role: "member" | "officer",
    officerTitle?: string,
  ) => {
    const response = await api.post(`/clubs/${clubId}/join`, {
      role,
      officerTitle,
    });
    return response.data;
  },

  cancelMembershipRequest: async (clubId: number) => {
    const response = await api.delete(`/clubs/${clubId}/cancel`);
    return response.data;
  },

  getPendingRequests: async (clubId: number) => {
    const response = await api.get<PendingApplicant[]>(
      `/clubs/${clubId}/pending-requests`,
    );
    return response.data;
  },

  updateMembershipStatus: async (
    clubId: number,
    userId: number,
    status: "approved" | "rejected",
  ) => {
    const response = await api.patch(`/clubs/${clubId}/members/${userId}`, {
      status,
    });
    return response.data;
  },

  getClubMembers: async (clubId: number) => {
    const response = await api.get(`/clubs/${clubId}/members`);
    return response.data;
  },

  addMember: async (
    clubId: number,
    data: { email: string; role: "member" | "officer"; officerTitle?: string },
  ) => {
    const response = await api.post(`/clubs/${clubId}/members/add`, {
      add_by: "email",
      email: data.email,
      role: data.role,
      officerTitle: data.officerTitle,
    });
    return response.data;
  },

  removeMember: async (clubId: number, userId: number) => {
    const response = await api.delete(
      `/clubs/${clubId}/members/${userId}/remove`,
    );
    return response.data;
  },

  updateMemberRole: async (
    clubId: number,
    userId: number,
    data: { role: "member" | "officer"; officerTitle?: string },
  ) => {
    const response = await api.patch(
      `/clubs/${clubId}/members/${userId}/edit`,
      {
        role: data.role,
        officer_title: data.role === "officer" ? data.officerTitle : null,
      },
    );
    return response.data;
  },
};
