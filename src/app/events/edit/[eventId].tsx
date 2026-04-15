import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { useEventDetails, useEventMutations } from "@/src/hooks/useEvents";
import EventEditScreen from "@/src/screens/private/events/EventEditScreen";

export default function EditEventRoute() {
  const router = useThrottledRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  // Fetch the existing event data
  const { data: event, isLoading, isError } = useEventDetails(Number(eventId));
  // Grab the update mutation
  const { updateEvent, isUpdating } = useEventMutations();

  const handleUpdate = async (formData: FormData) => {
    try {
      await updateEvent({ id: Number(eventId), data: formData });
      Alert.alert("Success", "Event updated successfully!");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update event.");
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <Text className="text-red-500 font-medium">Failed to load event details.</Text>
      </View>
    );
  }

  return (
    <EventEditScreen
      event={event}
      isUpdating={isUpdating}
      onBack={() => router.back()}
      onSubmit={handleUpdate}
    />
  );
}