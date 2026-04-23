import { EventCard } from "@/src/components/events/EventCard";
import { CreateEventModal } from "@/src/components/modals/CreateEventModal";
import { useClub } from "@/src/contexts/ClubContext";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
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
}

export default function EventsScreen({
  events,
  isLoading,
  onAccessEvent,
}: Props) {
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { primaryColor } = useTheme();
  const { canManageClub } = useCanManageClub();

  const isAdmin = useIsAdmin(); 
  const { clubs, activeClubId } = useClub();
  const canManage = activeClubId && canManageClub(activeClubId);
  const activeClub = clubs.find((c) => c.id === activeClubId);

  const filteredEvents = events?.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      {/* Header */}
      <View className="px-4 mt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-muted-fg dark:text-dark-muted-fg text-2xl font-medium">
              Welcome to,
            </Text>
            <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
              Events
            </Text>
          </View>
        </View>
      </View>

      {/* Search & Add Section */}
      <View className="px-4 mt-8 flex-row gap-4">
        <View className="flex-1 bg-background dark:bg-dark-bg rounded-2xl flex-row items-center px-4 h-14 border border-border dark:border-dark-border">
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search events"
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-3 text-base text-foreground dark:text-dark-fg"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {isAdmin && (
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)} // Toggle Modal
            className="w-14 h-14 bg-primary dark:bg-dark-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Events List */}
      <View className="flex-1 px-4 mt-8">
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
            contentContainerStyle={{ paddingBottom: 40 }}
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
      </View>
      <CreateEventModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </SafeAreaView>
  );
}
