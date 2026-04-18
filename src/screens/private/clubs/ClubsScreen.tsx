import { ClubCard } from "@/src/components/clubs/ClubCard";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { CreateClubModal } from "@/src/components/modals/CreateClubModal";
import {
  CATEGORY_LABEL_MAP,
  CATEGORY_OPTIONS,
  CATEGORY_VALUE_MAP,
  VIEW_FILTER_LABEL_MAP,
  VIEW_FILTER_OPTIONS,
  VIEW_FILTER_VALUE_MAP,
} from "@/src/constants/clubOptions";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { useTheme } from "@/src/hooks/useTheme";
import { clubService } from "@/src/services/clubService";
import { membershipService } from "@/src/services/membershipService";
import { Club, ClubCategory, ClubViewFilter } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  clubs: Club[] | undefined;
  isLoading: boolean;
  selectedCategory: ClubCategory | undefined;
  onSelectCategory: (category: ClubCategory | undefined) => void;
  viewFilter: ClubViewFilter;
  onSelectViewFilter: (filter: ClubViewFilter) => void;
  onAccessClub: (clubId: number) => void;
}

export default function ClubsScreen({
  clubs,
  isLoading,
  selectedCategory,
  onSelectCategory,
  viewFilter,
  onSelectViewFilter,
  onAccessClub,
}: Props) {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();
  const isAdmin = useIsAdmin();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const { data: membershipStatuses = {} } = useQuery({
    queryKey: ["userMemberships"],
    queryFn: async () => {
      const [approvedClubs, pendingClubs] = await Promise.all([
        clubService.getMyClubs(),
        clubService.getMyPendingClubs(),
      ]);

      const statusMap: Record<number, "approved" | "pending" | "rejected"> = {};

      approvedClubs.forEach((club) => {
        statusMap[club.id] = "approved";
      });

      pendingClubs.forEach((club) => {
        statusMap[club.id] = "pending";
      });

      return statusMap;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (clubId: number) => {
      return await membershipService.joinClub(clubId, "member");
    },
    onMutate: async (clubId) => {
      await queryClient.cancelQueries({ queryKey: ["userMemberships"] });
      const previousStatuses = queryClient.getQueryData(["userMemberships"]);

      queryClient.setQueryData(["userMemberships"], (old: any) => ({
        ...old,
        [clubId]: "pending",
      }));

      return { previousStatuses };
    },
    onError: (_err, _clubId, context) => {
      queryClient.setQueryData(["userMemberships"], context?.previousStatuses);
      Alert.alert(
        "Error",
        "Failed to apply to club. Check if your profile is complete.",
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userMemberships"] });
    },
  });

  const handleApplyClub = (clubId: number) => {
    applyMutation.mutate(clubId);
  };

  const handleSelectCategory = (val: string) => {
    onSelectCategory(CATEGORY_VALUE_MAP[val]);
  };

  const handleSelectViewFilter = (val: string) => {
    const filter = VIEW_FILTER_VALUE_MAP[val];
    if (filter) onSelectViewFilter(filter);
  };

  const categoryDropdownValue = selectedCategory
    ? CATEGORY_LABEL_MAP[selectedCategory]
    : "";

  const viewFilterDropdownValue =
    viewFilter === "all" ? "" : VIEW_FILTER_LABEL_MAP[viewFilter];

  const hasActiveFilters =
    selectedCategory !== undefined || viewFilter !== "all";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4 pt-4 relative">
      <View className="mb-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-2xl font-medium">
          Welcome to,
        </Text>
        <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
          Clubs
        </Text>
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1">
          <CustomDropdown
            label="Category"
            value={categoryDropdownValue}
            options={CATEGORY_OPTIONS}
            placeholder="All"
            onSelect={handleSelectCategory}
          />
        </View>
        <View className="flex-1">
          <CustomDropdown
            label="View"
            value={viewFilterDropdownValue}
            options={VIEW_FILTER_OPTIONS}
            placeholder="All clubs"
            onSelect={handleSelectViewFilter}
          />
        </View>
      </View>

      {hasActiveFilters && (
        <View className="flex-row gap-2 mb-4 flex-wrap -mt-2">
          {selectedCategory && (
            <View className="bg-primary/10 dark:bg-dark-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs text-primary dark:text-dark-primary">
                {CATEGORY_LABEL_MAP[selectedCategory]}
              </Text>
            </View>
          )}
          {viewFilter !== "all" && (
            <View className="bg-primary/10 dark:bg-dark-primary/10 px-3 py-1 rounded-full">
              <Text className="text-xs text-primary dark:text-dark-primary">
                {VIEW_FILTER_LABEL_MAP[viewFilter]}
              </Text>
            </View>
          )}
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No clubs found for this filter.
            </Text>
          }
          renderItem={({ item }) => (
            <ClubCard
              club={item}
              membershipStatus={membershipStatuses[item.id] || null}
              isApplying={
                applyMutation.variables === item.id && applyMutation.isPending
              }
              onAccessClub={onAccessClub}
              onApplyClub={handleApplyClub}
            />
          )}
        />
      )}

      {isAdmin && (
        <TouchableOpacity
          onPress={() => setIsCreateModalVisible(true)}
          className="absolute bottom-6 right-5 w-14 h-14 bg-primary dark:bg-dark-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 elevation-5"
        >
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>
      )}

      <CreateClubModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
      />
    </SafeAreaView>
  );
}
