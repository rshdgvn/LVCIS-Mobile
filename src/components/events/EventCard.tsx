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
  
  // Safe fallback for club users
  const users = club?.users || [];

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.8}
      // Design: bg-[#F8F9FA], 32px rounded, p-6
      className="bg-[#F8F9FA] dark:bg-dark-input p-6 rounded-[32px] mb-4 border border-zinc-100/50 dark:border-dark-border shadow-sm"
    >
      {/* Event Title */}
      <Text className="text-xl font-bold text-zinc-900 dark:text-dark-fg mb-4">
        {title}
      </Text>

      {/* Date & Time Row */}
      <View className="flex-row items-center mb-3 gap-3">
        <View className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-50 dark:border-zinc-700">
          <Ionicons name="calendar" size={16} color="#3b82f6" />
        </View>
        <Text className="text-zinc-500 dark:text-gray-400 text-sm font-medium">
          {detail?.event_date 
            ? new Date(detail.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
            : 'N/A'}
          <Text className="mx-1 opacity-50">  •  </Text>
          {detail?.event_time?.substring(0, 5) || 'N/A'}
        </Text>
      </View>

      {/* Location Row */}
      <View className="flex-row items-center mb-6 gap-3">
        <View className="p-2 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-50 dark:border-zinc-700">
          <Ionicons name="location" size={16} color="#3b82f6" />
        </View>
        <Text 
          className="text-zinc-500 dark:text-gray-400 text-sm font-medium flex-1" 
          numberOfLines={1}
        >
          {detail?.venue || 'No venue set'}
        </Text>
      </View>

      {/* Avatars Section */}
      <View className="flex-row items-center">
        <View className="flex-row">
          {users.slice(0, 3).map((user, index) => (
            <View 
              key={user.id} 
              style={{ marginLeft: index === 0 ? 0 : -12 }} // Overlap logic
              className="w-10 h-10 rounded-full border-2 border-white dark:border-dark-input overflow-hidden bg-gray-200"
            >
              <Image 
                source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
                className="w-full h-full"
              />
            </View>
          ))}
          
          {users.length > 3 && (
            <View 
              style={{ marginLeft: -12 }}
              className="w-10 h-10 rounded-full bg-zinc-400 border-2 border-white dark:border-dark-input items-center justify-center"
            >
              <Text className="text-[10px] text-white font-bold">
                +{users.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};