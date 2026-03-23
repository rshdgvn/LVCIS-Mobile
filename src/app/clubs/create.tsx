import { useClubMutations } from "@/src/hooks/useClubs";
import ClubCreateScreen from "@/src/screens/private/clubs/ClubCreateScreen";
import { ClubPayload } from "@/src/types/club";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

export default function CreateClubRoute() {
  const router = useRouter();
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
