import { useTheme } from "@/src/hooks/useTheme";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
  const { detail, title, club } = event;
  const { primaryColor } = useTheme();

  // Safe fallback for club users
  const users = club?.users || [];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-card dark:bg-dark-card p-6 rounded-2xl mb-4 border border-border dark:border-dark-border"
    >
      {/* Event Title */}
      <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-4">
        {title}
      </Text>

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

      {/* Avatars Section */}
      <View className="flex-row items-center">
        <View className="flex-row">
          {users.slice(0, 3).map((user, index) => (
            <View
              key={user.id}
              style={{ marginLeft: index === 0 ? 0 : -12 }} // Overlap logic
              className="w-10 h-10 rounded-full border-2 border-card dark:border-dark-card overflow-hidden bg-muted dark:bg-dark-muted"
            >
              <Image
                source={{
                  uri: user.avatar || "https://via.placeholder.com/150",
                }}
                className="w-full h-full"
              />
            </View>
          ))}

          {users.length > 3 && (
            <View
              style={{ marginLeft: -12 }}
              className="w-10 h-10 rounded-full bg-muted dark:bg-dark-muted border-2 border-card dark:border-dark-card items-center justify-center"
            >
              <Text className="text-[10px] text-foreground dark:text-dark-fg font-bold">
                +{users.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
