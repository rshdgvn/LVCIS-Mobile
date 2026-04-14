import React from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventDetails } from "@/src/hooks/useEvents";
import { Href } from "expo-router";
import EventDetailsScreen from "@/src/screens/private/events/EventDetailsScreen";

export default function EventDetailsRoute() {

  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  
  // Ensure it's converted to a number for the API call
  const id = Number(eventId);
  const { data: event, isLoading } = useEventDetails(id);

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (eventId: number) => {
    router.push(`/events/edit/${eventId}` as Href);
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <EventDetailsScreen
        event={event}
        isLoading={isLoading}
        onBack={handleBack}
        onEdit={handleEdit}
      />
    </View>
  );
}