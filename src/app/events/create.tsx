import React from "react";
import { Alert } from "react-native";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import { useEventMutations } from "@/src/hooks/useEvents";
import EventCreateScreen from "@/src/screens/private/events/EventCreateScreen";

export default function CreateEventRoute() {
  const router = useThrottledRouter();
  const { createEvent, isCreating } = useEventMutations();

  const handleCreate = async (formData: FormData) => {
    try {
      await createEvent(formData);
      Alert.alert("Success", "Event created successfully!");
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create event. Please check inputs.");
    }
  };

  return (
    <EventCreateScreen
      isCreating={isCreating}
      onBack={() => router.back()}
      onSubmit={handleCreate}
    />
  );
}