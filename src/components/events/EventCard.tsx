import { useTheme } from "@/src/hooks/useTheme";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
  const { detail, title, club } = event;
  const { primaryColor } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-card dark:bg-dark-card p-6 rounded-2xl mb-4 border border-border dark:border-dark-border"
    >
      {/* Event Title + Club Badge */}
      <View className="flex-row items-start justify-between mb-4 gap-3">
        <Text className="text-xl font-bold text-foreground dark:text-dark-fg flex-1">
          {title}
        </Text>
        {club?.name && (
          <View className="flex-row items-center gap-1.5 bg-primary/10 dark:bg-dark-primary/10 px-2.5 py-1 rounded-full">
            <Ionicons name="people" size={11} color={primaryColor} />
            <Text
              className="text-[11px] font-semibold text-primary dark:text-dark-primary"
              numberOfLines={1}
            >
              {club.name}
            </Text>
          </View>
        )}
      </View>

      {/* Date & Time Row */}
      <View className="flex-row items-center mb-3 gap-3">
        <View className="p-2 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border">
          <Ionicons name="calendar" size={16} color={primaryColor} />
        </View>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-sm font-medium">
          {detail?.event_date
            ? new Date(detail.event_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A"}
          <Text className="mx-1 opacity-50"> • </Text>
          {detail?.event_time?.substring(0, 5) || "N/A"}
        </Text>
      </View>

      {/* Location Row */}
      <View className="flex-row items-center mb-6 gap-3">
        <View className="p-2 bg-background dark:bg-dark-bg rounded-xl border border-border dark:border-dark-border">
          <Ionicons name="location" size={16} color={primaryColor} />
        </View>
        <Text
          className="text-muted-fg dark:text-dark-muted-fg text-sm font-medium flex-1"
          numberOfLines={1}
        >
          {detail?.venue || "No venue set"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
