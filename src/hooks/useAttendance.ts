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
        return {
          ...oldData,
          members: oldData.members.map((member: any) =>
            member.user_id === userId ? { ...member, status: status } : member,
          ),
        };
      });

      return { previousSession };
    },
    onError: (err, variables, context) => {
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

export const useAttendanceMutations = () => {
  const queryClient = useQueryClient();

  const createSession = useMutation({
    mutationFn: (data: SessionPayload) => attendanceService.createSession(data),
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
