import { useClubMutations } from "@/src/hooks/useClubs";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ClubCreateScreen from "@/src/screens/private/clubs/ClubCreateScreen";
import { ClubPayload } from "@/src/types/club";
import React from "react";
import { Alert } from "react-native";

export default function CreateClubRoute() {
  const router = useThrottledRouter();
  const { createClub, isCreating } = useClubMutations();

  const handleCreate = async (data: ClubPayload) => {
    try {
      await createClub(data);
      Alert.alert("Success", "Club created successfully!");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to create club. Please try again.");
    }
  };

  return (
    <ClubCreateScreen
      isCreating={isCreating}
      onBack={() => router.back()}
      onSubmit={handleCreate}
    />
  );
}
