import { clubService } from "@/src/services/clubService";
import { Club, ClubCategory, ClubPayload } from "@/src/types/club";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ClubViewFilter = "all" | "my" | "pending" | "other";

export const useFilteredClubs = (
  viewFilter: ClubViewFilter,
  category?: ClubCategory,
) => {
  return useQuery({
    queryKey: ["clubs", viewFilter, category],
    queryFn: async () => {
      let data: Club[] = [];

      switch (viewFilter) {
        case "my":
          data = await clubService.getMyClubs();
          break;
        case "pending":
          data = await clubService.getMyPendingClubs();
          break;
        case "other":
          data = await clubService.getOtherClubs();
          break;
        case "all":
        default:
          data = await clubService.getAllClubs(category);
          return data;
      }

      if (category) {
        return data.filter((club) => club.category === category);
      }

      return data;
    },
  });
};

export const useClubDetails = (id: number) => {
  return useQuery({
    queryKey: ["club", id],
    queryFn: () => clubService.getClubById(id),
    enabled: !!id,
  });
};

export const useClubMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ClubPayload) => clubService.createClub(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClubPayload | FormData }) =>
      clubService.updateClub(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["club", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clubService.deleteClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });

  return {
    createClub: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateClub: updateMutation.mutateAsync as (args: {
      id: number;
      data: ClubPayload | FormData;
    }) => Promise<Club>,
    isUpdating: updateMutation.isPending,
    deleteClub: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
