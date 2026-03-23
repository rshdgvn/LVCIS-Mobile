import { useClubDetails, useClubMutations } from "@/src/hooks/useClubs";
import { ClubPayload } from "@/src/types/club";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import ClubEditScreen from "@/src/screens/private/clubs/ClubEditScreen";

export default function EditClubRoute() {
  const router = useRouter();
  const { clubId } = useLocalSearchParams<{ clubId: string }>();

  const { data: club, isLoading, isError } = useClubDetails(Number(clubId));
  const { updateClub, isUpdating } = useClubMutations();

  const handleUpdate = async (formData: ClubPayload) => {
    try {
      await updateClub({ id: Number(clubId), data: formData });
      Alert.alert("Success", "Club updated successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update club.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !club) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <Text className="text-red-500">Failed to load club details.</Text>
      </View>
    );
  }

  return (
    <ClubEditScreen
      club={club}
      isUpdating={isUpdating}
      onBack={() => router.back()}
      onSubmit={handleUpdate}
    />
  );
}
