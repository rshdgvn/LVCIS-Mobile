import { useClubDetails } from "@/src/hooks/useClubs";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ClubDetailsScreen from "@/src/screens/private/clubs/ClubDetailsScreen";
import { Href, useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function ClubDetailsRoute() {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();
  const router = useThrottledRouter();

  const { data: club, isLoading, isError } = useClubDetails(Number(clubId));

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <Text className="text-red-500">Failed to load club details.</Text>
      </View>
    );
  }

  const handleEditClub = (clubId: number) => {
    router.push(`/clubs/edit/${clubId}` as Href);
  };

  return (
    <ClubDetailsScreen
      club={club}
      isLoading={isLoading}
      onBack={() => router.back()}
      onEdit={handleEditClub}
    />
  );
}
