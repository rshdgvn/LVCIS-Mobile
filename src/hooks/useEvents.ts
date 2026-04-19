import { eventService } from "@/src/services/eventService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Fetch all events then filter by active club on the frontend
export const useAllEvents = (clubId: number | null) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
    select: (data) =>
      clubId ? data.filter((e) => e.club_id === clubId) : data,
    enabled: true,
  });
};

export const useEventDetails = (id: number) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id,
  });
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => eventService.addEvent(data),
    onSuccess: () => {
      // Invalidate all event queries regardless of club
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      eventService.updateEvent({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  return {
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEvent: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEvent: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
