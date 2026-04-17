import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";
import { AttendanceStatus, SessionPayload } from "../types/attendance";

export const useSessions = (clubId: number | null) => {
  return useQuery({
    queryKey: ["attendanceSessions", clubId],
    queryFn: () => attendanceService.getSessions(clubId!),
    enabled: !!clubId,
  });
};

export const useSession = (sessionId: number | null) => {
  return useQuery({
    queryKey: ["attendanceSession", sessionId],
    queryFn: () => attendanceService.getSession(sessionId!),
    enabled: !!sessionId, 
  });
};

export const useSessionAttendances = (sessionId: number | null) => {
  return useQuery({
    queryKey: ["sessionAttendances", sessionId],
    queryFn: () => attendanceService.getSessionAttendances(sessionId!),
    enabled: !!sessionId,
  });
};

export const useMemberAttendance = (
  userId: number | null,
  clubId: number | null,
) => {
  return useQuery({
    queryKey: ["memberAttendance", userId, clubId],
    queryFn: () => attendanceService.getMemberAttendance(userId!, clubId!),
    enabled: !!userId && !!clubId,
  });
};

export const useAttendanceMutations = () => {
  const queryClient = useQueryClient();

  const createSession = useMutation({
    mutationFn: (data: SessionPayload) => attendanceService.createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
    },
  });

  const updateSession = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionPayload> }) =>
      attendanceService.updateSession(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
    },
  });

  const deleteSession = useMutation({
    mutationFn: (id: number) => attendanceService.deleteSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({
      sessionId,
      userId,
      status,
    }: {
      sessionId: number;
      userId: number;
      status: AttendanceStatus;
    }) => attendanceService.updateUserStatus(sessionId, userId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sessionAttendances", variables.sessionId],
      });
      queryClient.invalidateQueries({ queryKey: ["memberAttendance"] });
    },
  });

  return {
    createSession,
    updateSession,
    deleteSession,
    updateStatus,
  };
};
