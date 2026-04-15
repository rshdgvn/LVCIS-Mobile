import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/src/services/eventService";

// Fetch hook for the list
export const useAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
  });
};

export const useEventDetails = (id: number) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEventById(id),
    enabled: !!id, // Only run the query if we have a valid ID
  });
};

// Mutation hook (You already have this, just keeping it here for reference)
export const useEventMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: FormData) => eventService.addEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => eventService.updateEvent(id, data),
    onSuccess: (_, variables) => {
      // Refresh both the main list AND the specific event details
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });

  return {
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEvent: updateMutation.mutateAsync, // Export the new mutation
    isUpdating: updateMutation.isPending,    // Export loading state
  };
};