import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useClubDetails } from "@/src/hooks/useClubs";
import ClubDetailsScreen from "@/src/screens/private/clubs/ClubDetailsScreen";
import { View, Text } from "react-native";

export default function ClubDetailsRoute() {
  const { clubId } = useLocalSearchParams<{ clubId: string }>();
  const router = useRouter();

  const { data: club, isLoading, isError } = useClubDetails(Number(clubId));

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <Text className="text-red-500">Failed to load club details.</Text>
      </View>
    );
  }

  return (
    <ClubDetailsScreen 
      club={club} 
      isLoading={isLoading} 
      onBack={() => router.back()} 
      onEdit={() => console.log("Edit")} 
    />
  );
}