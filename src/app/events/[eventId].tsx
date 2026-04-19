import { useEventDetails, useEventMutations } from "@/src/hooks/useEvents";
import EventDetailsScreen from "@/src/screens/private/events/EventDetailsScreen";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

export default function EventDetailsRoute() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();

  const id = Number(eventId);
  const { data: event, isLoading } = useEventDetails(id);
  const { deleteEvent, isDeleting } = useEventMutations();

  const handleBack = () => router.back();

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      Toast.show({ type: "success", text1: "Event deleted successfully!" });
      router.replace("/events" as Href);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Failed to delete event. Please try again.",
      });
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <EventDetailsScreen
        event={event}
        isLoading={isLoading}
        isDeleting={isDeleting}
        onBack={handleBack}
        onDelete={handleDelete}
      />
    </View>
  );
}
