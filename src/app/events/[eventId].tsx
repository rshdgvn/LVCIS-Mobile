import React from "react";
import { View, Alert } from "react-native"; 
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEventDetails, useEventMutations } from "@/src/hooks/useEvents"; 
import { Href } from "expo-router";
import EventDetailsScreen from "@/src/screens/private/events/EventDetailsScreen";

export default function EventDetailsRoute() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  
  const id = Number(eventId);
  const { data: event, isLoading } = useEventDetails(id);

  const { deleteEvent, isDeleting } = useEventMutations();

  const handleBack = () => {
    router.back();
  };

  const handleEdit = (eventId: number) => {
    router.push(`/events/edit/${eventId}` as Href);
  };
  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvent(id);
              Alert.alert("Success", "Event has been deleted.");
              router.replace("/events" as Href); 
            } catch (error) {
              Alert.alert("Error", "Failed to delete event. Please try again.");
            }
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <EventDetailsScreen
        event={event}
        isLoading={isLoading}
        isDeleting={isDeleting} 
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete} 
      />
    </View>
  );
}