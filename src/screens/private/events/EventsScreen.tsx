import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { EventCard } from "@/src/components/events/EventCard";
import { CreateEventModal } from "@/src/components/modals/CreateEventModal"; 
import { Event } from "@/src/types/event";
import { useTheme } from "@/src/hooks/useTheme";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";

interface Props {
  events: Event[] | undefined;
  isLoading: boolean;
  onAccessEvent: (eventId: number) => void;
  onCreateEvent?: () => void;
}

export default function EventsScreen({ events, isLoading, onAccessEvent }: Props) {
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Local visibility state
  const { primaryColor } = useTheme();
  const isAdmin = useIsAdmin();

  const filteredEvents = events?.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-bg">
      {/* Header */}
      <View className="px-8 mt-6 flex-row justify-between items-start">
        <View>
          <Text className="text-zinc-500 dark:text-gray-400 text-2xl font-medium">Welcome to,</Text>
          <Text className="text-zinc-900 dark:text-white text-3xl font-bold">Events</Text>
        </View>
      </View>

      {/* Search & Add Section */}
      <View className="px-8 mt-8 flex-row gap-4">
        <View className="flex-1 bg-zinc-50 dark:bg-dark-input rounded-2xl flex-row items-center px-4 h-14 border border-zinc-100 dark:border-dark-border">
          <Ionicons name="search" size={20} color="#a1a1aa" />
          <TextInput
            placeholder="Search events"
            placeholderTextColor="#a1a1aa"
            className="flex-1 ml-3 text-zinc-800 dark:text-white"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isAdmin && (
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)} // Toggle Modal
            className="w-14 h-14 bg-blue-500 rounded-2xl items-center justify-center shadow-lg shadow-blue-200"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Events List */}
      <View className="flex-1 px-8 mt-8">
        {isLoading ? (
          <ActivityIndicator size="large" color={primaryColor} className="mt-10" />
        ) : (
          <FlatList
            data={filteredEvents}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={<Text className="text-center text-zinc-400 mt-10">No events found.</Text>}
            renderItem={({ item }) => (
              <EventCard event={item} onPress={() => onAccessEvent(item.id)} />
            )}
          />
        )}
      </View>
      <CreateEventModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
      />
    </SafeAreaView>
  );
}