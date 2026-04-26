import { eventService } from "@/src/services/eventService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAllEvents = (
  clubId: number | null,
  isAdmin: boolean = false,
) => {
  return useQuery({
    queryKey: ["events", clubId],
    queryFn: () => eventService.getAllEvents(clubId),
    enabled: isAdmin ? true : !!clubId,
  });
};

export const useEventDetails = (id: number | null) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id!),
    enabled: !!id,  
  });
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => eventService.addEvent(data),
    onSuccess: () => {
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
    createEvent: createMutation,
    updateEvent: updateMutation,
    deleteEvent: deleteMutation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
