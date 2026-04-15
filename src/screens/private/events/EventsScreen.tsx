import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EventCard } from "@/src/components/events/EventCard";
import { Event } from "@/src/types/event";
import { useTheme } from "@/src/hooks/useTheme";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";

interface Props {
  events: Event[] | undefined;
  isLoading: boolean;
  onAccessEvent: (eventId: number) => void;
  onCreateEvent: () => void;
}

export default function EventsScreen({ events, isLoading, onAccessEvent, onCreateEvent }: Props) {
  const [search, setSearch] = useState("");
  const { primaryColor } = useTheme();
  const isAdmin = useIsAdmin(); // Or check if user is officer, depending on your logic

  // Simple search filter
  const filteredEvents = events?.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-5 pt-4 relative">
      
      {/* Header */}
      <View className="mb-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-lg">Welcome to,</Text>
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">Events</Text>
      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 dark:bg-dark-input px-4 rounded-2xl h-14 mb-6">
        <Ionicons name="search-outline" size={20} color="#9ca3af" />
        <TextInput
          placeholder="Search events"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-3 text-foreground dark:text-dark-fg"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Event List */}
      {isLoading ? (
        <ActivityIndicator size="large" color={primaryColor} className="mt-10" />
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No events found.
            </Text>
          }
          renderItem={({ item }) => (
            <EventCard 
              event={item} 
              onPress={() => onAccessEvent(item.id)} 
            />
          )}
        />
      )}

      {/* Floating Action Button for Admins/Officers */}
      {isAdmin && (
        <TouchableOpacity 
          onPress={onCreateEvent}
          className="absolute bottom-6 right-5 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg elevation-5"
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

    </SafeAreaView>
  );
}