import { useAuth } from "@/src/contexts/AuthContext";
import { useClub } from "@/src/contexts/ClubContext";
import { useAllEvents } from "@/src/hooks/useEvents";
import EventsScreen from "@/src/screens/private/events/EventsScreen";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function EventsRoute() {
  const router = useRouter();
  const { activeClubId, isLoading: isClubLoading } = useClub();
  const { user, isLoading: isAuthLoading } = useAuth();

  const isAdmin = user?.role === "admin";
  const isContextLoading = isAuthLoading || isClubLoading;

  const { data: events, isLoading: isEventsLoading } = useAllEvents(
    activeClubId,
    isAdmin,
  );

  const handleAccessEvent = (eventId: number) => {
    router.push(`/events/${eventId}` as Href);
  };

  return (
    <View className="flex-1">
      <EventsScreen
        events={events}
        isLoading={isEventsLoading || isContextLoading}
        onAccessEvent={handleAccessEvent}
        isAdmin={isAdmin}
        isContextLoading={isContextLoading}
      />
    </View>
  );
}
