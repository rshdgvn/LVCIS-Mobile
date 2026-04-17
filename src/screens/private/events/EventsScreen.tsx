import { EventCard } from "@/src/components/events/EventCard";
<<<<<<< HEAD
=======
import { CreateEventModal } from "@/src/components/modals/CreateEventModal"; 
import { Event } from "@/src/types/event";
import { useTheme } from "@/src/hooks/useTheme";
>>>>>>> 74f395b (improve ui)
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { useTheme } from "@/src/hooks/useTheme";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  events: Event[] | undefined;
  isLoading: boolean;
  onAccessEvent: (eventId: number) => void;
  onCreateEvent?: () => void;
}

<<<<<<< HEAD
export default function EventsScreen({
  events,
  isLoading,
  onAccessEvent,
  onCreateEvent,
}: Props) {
=======
export default function EventsScreen({ events, isLoading, onAccessEvent }: Props) {
>>>>>>> 74f395b (improve ui)
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false); // Local visibility state
  const { primaryColor } = useTheme();
  const isAdmin = useIsAdmin();

<<<<<<< HEAD
  // Simple search filter
  const filteredEvents = events?.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-5 pt-4 relative">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-muted-fg dark:text-dark-muted-fg text-lg">
          Welcome to,
        </Text>
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
          Events
        </Text>
=======
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
>>>>>>> 74f395b (improve ui)
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

<<<<<<< HEAD
      {/* Event List */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
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
            <EventCard event={item} onPress={() => onAccessEvent(item.id)} />
          )}
        />
      )}

      {/* Floating Action Button for Admins/Officers */}
      {isAdmin && (
        <TouchableOpacity
          onPress={onCreateEvent}
          className="absolute bottom-6 right-5 w-14 h-14 bg-primary dark:bg-dark-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 elevation-5"
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
=======
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
>>>>>>> 74f395b (improve ui)
    </SafeAreaView>
  );
}
