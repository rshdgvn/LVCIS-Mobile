import { useClubDetails, useClubMutations } from "@/src/hooks/useClubs";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ClubEditScreen from "@/src/screens/private/clubs/ClubEditScreen";
import { ClubPayload } from "@/src/types/club";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function EditClubRoute() {
  const router = useThrottledRouter();
  const { clubId } = useLocalSearchParams<{ clubId: string }>();

  const { data: club, isLoading, isError } = useClubDetails(Number(clubId));
  const { updateClub, isUpdating } = useClubMutations();

  const handleUpdate = async (formData: ClubPayload & { logoUri?: string }) => {
    let payload: ClubPayload | FormData;

    if (formData.logoUri) {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("description", formData.description ?? "");
      form.append("logo", {
        uri: formData.logoUri,
        type: "image/jpeg",
        name: "logo.jpg",
      } as any);
      payload = form;
    } else {
      const { logoUri, ...rest } = formData;
      payload = rest;
    }

    try {
      await updateClub({ id: Number(clubId), data: payload });
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
