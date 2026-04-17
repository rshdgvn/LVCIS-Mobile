import React from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { useEventDetails, useEventMutations } from "@/src/hooks/useEvents";
import EventEditScreen from "@/src/screens/private/events/EventEditScreen";

export default function EditEventRoute() {
  const router = useThrottledRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data: event, isLoading, isError } = useEventDetails(Number(eventId));
  const { updateEvent, isUpdating } = useEventMutations();

  const handleUpdate = async (formData: FormData) => {
      try {
        const id = Number(eventId); 
        if (!id) return;

        await updateEvent({ id, data: formData });
        Alert.alert("Success", "Event updated!");
        router.back();
      } catch (error: any) {
        console.error(error.response?.data); 
        
        if (error.response?.status === 422) {
          const errors = error.response.data.errors;
          const firstErrorKey = Object.keys(errors)[0];
          const firstErrorMessage = errors[firstErrorKey][0];
          
          Alert.alert("Validation Error", firstErrorMessage);
        } else {
          Alert.alert("Error", "Failed to update event.");
        }
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