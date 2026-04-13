import React from "react";
import { View } from "react-native";
import { Href, useRouter } from "expo-router";
import { useAllEvents } from "@/src/hooks/useEvents";
import EventsScreen from "@/src/screens/private/events/EventsScreen";

export default function EventsRoute() {
  const router = useRouter();
  
  // Using React Query so it auto-refreshes when a new event is created!
  const { data: events, isLoading } = useAllEvents();

  const handleAccessEvent = (eventId: number) => {
    router.push(`/events/${eventId}` as Href);
  };

  const handleCreateEvent = () => {
    router.push("/events/create" as Href);
  };

  return (
    <View className="flex-1">
      <EventsScreen
        events={events}
        isLoading={isLoading}
        onAccessEvent={handleAccessEvent}
        onCreateEvent={handleCreateEvent}
      />
    </View>
  );
}