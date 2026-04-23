import { taskService } from "@/src/services/taskService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEventTasks = (eventId: number | null) => {
  return useQuery({
    queryKey: ["tasks", eventId],
    queryFn: () => taskService.getTasksByEvent(eventId!),
    enabled: !!eventId,
  });
};

export const useTaskMutations = (eventId: number | null) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["tasks", eventId] });
  };

  const createMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Parameters<typeof taskService.updateTask>[1];
    }) => taskService.updateTask(id, data),
    onSuccess: invalidate,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number;
      status: "pending" | "in_progress" | "completed";
    }) => taskService.updateTaskStatus(id, status),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: invalidate,
  });

  return {
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTask: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateTaskStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
    deleteTask: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
