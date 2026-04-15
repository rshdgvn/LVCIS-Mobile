import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "@/src/types/event";

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard = ({ event, onPress }: EventCardProps) => {
  const { detail, title, club } = event;
  
  // SAFE FALLBACK: If users is undefined, it defaults to an empty array.
  const users = club?.users || [];

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white dark:bg-dark-input p-5 rounded-3xl mb-4 shadow-sm border border-gray-100 dark:border-dark-border"
    >
      <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-3">
        {title}
      </Text>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar-outline" size={16} color="#3b82f6" />
        <Text className="ml-2 text-gray-500 dark:text-gray-400 text-sm">
          {detail?.event_date ? new Date(detail.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
          {"  •  "}
          {detail?.event_time || 'N/A'}
        </Text>
      </View>

      <View className="flex-row items-center mb-4">
        <Ionicons name="location-outline" size={16} color="#3b82f6" />
        <Text className="ml-2 text-gray-500 dark:text-gray-400 text-sm" numberOfLines={1}>
          {detail?.venue || 'No venue set'}
        </Text>
      </View>

      {/* Avatars Section (Now Crash-Proof) */}
      <View className="flex-row items-center">
        {users.slice(0, 3).map((user) => (
          <View 
            key={user.id} 
            className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-input -mr-3 overflow-hidden bg-gray-200"
          >
            <Image 
              source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
              className="w-full h-full"
            />
          </View>
        ))}
        {users.length > 3 && (
          <View className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white items-center justify-center">
            <Text className="text-[10px] text-white font-bold">
              +{users.length - 3}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};