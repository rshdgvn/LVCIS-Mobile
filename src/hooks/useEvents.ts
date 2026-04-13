import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventService } from "@/src/services/eventService";

// Fetch hook for the list
export const useAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAllEvents(),
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

  return {
    createEvent: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
};