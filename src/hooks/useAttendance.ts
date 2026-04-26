import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendanceService";
import { AttendanceStatus, SessionPayload } from "../types/attendance";

export const useSessions = (
  clubId: number | null,
  isAdmin: boolean = false,
) => {
  return useQuery({
    queryKey: ["attendanceSessions", clubId],
    queryFn: () => attendanceService.getSessions(clubId),
    enabled: isAdmin ? true : !!clubId,
  });
};

export const useSession = (sessionId: number | null) => {
  return useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => attendanceService.getSession(sessionId!),
    enabled: !!sessionId,
  });
};

export const useUpdateAttendanceStatus = (sessionId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      status,
    }: {
      userId: number;
      status: AttendanceStatus;
    }) => attendanceService.updateUserStatus(sessionId!, userId, status),

    onMutate: async ({ userId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["session", sessionId] });
      const previousSession = queryClient.getQueryData(["session", sessionId]);

      queryClient.setQueryData(["session", sessionId], (oldData: any) => {
        if (!oldData || !oldData.members) return oldData;
        const newMembers = oldData.members.map((m: any) =>
          m.user_id === userId ? { ...m, status } : m,
        );
        return { ...oldData, members: newMembers };
      });

      return { previousSession };
    },
    onError: (err, newStatus, context) => {
      if (context?.previousSession) {
        queryClient.setQueryData(
          ["session", sessionId],
          context.previousSession,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
    },
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
    mutationFn: (data: SessionPayload & { club_id?: number | null }) =>
      attendanceService.createSession(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] }),
  });

  const updateSession = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SessionPayload> }) =>
      attendanceService.updateSession(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] }),
  });

  const deleteSession = useMutation({
    mutationFn: (id: number) => attendanceService.deleteSession(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] }),
  });

  return {
    createSession,
    updateSession,
    deleteSession,
  };
};
