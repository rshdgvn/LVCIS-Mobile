import { useClub } from "@/src/contexts/ClubContext";
import { useAllEvents } from "@/src/hooks/useEvents";
import EventsScreen from "@/src/screens/private/events/EventsScreen";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EventsRoute() {
  const router = useRouter();
  const { activeClubId } = useClub();

  const { data: events, isLoading } = useAllEvents(activeClubId);

  const handleAccessEvent = (eventId: number) => {
    router.push(`/events/${eventId}` as Href);
  };

  return (
    <View className="flex-1">
      <EventsScreen
        events={events}
        isLoading={isLoading}
        onAccessEvent={handleAccessEvent}
      />
    </View>
  );
}
