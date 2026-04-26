import { EventCard } from "@/src/components/events/EventCard";
import { CreateEventModal } from "@/src/components/modals/CreateEventModal";
import { useClub } from "@/src/contexts/ClubContext";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { useTheme } from "@/src/hooks/useTheme";
import { Event } from "@/src/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  isContextLoading: boolean;
  onAccessEvent: (eventId: number) => void;
  isAdmin: boolean;
}

export default function EventsScreen({
  events,
  isLoading,
  isContextLoading,
  onAccessEvent,
  isAdmin,
}: Props) {
  const [search, setSearch] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { primaryColor } = useTheme();
  const { canManageClub } = useCanManageClub();

  const { clubs, activeClubId } = useClub();

  const canManage = (activeClubId && canManageClub(activeClubId)) || isAdmin;

  if (isContextLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background dark:bg-dark-bg"
        edges={["top"]}
      >
        <View className="px-4 mt-4 pb-3">
          <Text className="text-muted-fg dark:text-dark-muted-fg text-2xl font-medium">
            Welcome to,
          </Text>
          <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
            Events
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      </SafeAreaView>
    );
  }

  if (!activeClubId && !isAdmin) {
    return (
      <SafeAreaView
        className="flex-1 bg-background dark:bg-dark-bg"
        edges={["top"]}
      >
        <View className="px-4 mt-4 pb-3">
          <Text className="text-muted-fg dark:text-dark-muted-fg text-2xl font-medium">
            Welcome to,
          </Text>
          <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
            Events
          </Text>
        </View>
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-20 h-20 bg-primary/10 dark:bg-dark-primary/10 rounded-full items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="calendar-blank-outline"
              size={36}
              color={primaryColor}
            />
          </View>
          <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-2">
            No Club Selected
          </Text>
          <Text className="text-sm text-center text-muted-fg dark:text-dark-muted-fg">
            {clubs.length === 0
              ? "You are not part of any clubs yet."
              : "You need to join a club to access events."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const filteredEvents =
    events?.filter((event) =>
      event.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="px-4 mt-4 pb-3">
        <View className="flex-row justify-between mb-8 items-start">
          <View>
            <Text className="text-muted-fg dark:text-dark-muted-fg text-2xl font-medium">
              Welcome to,
            </Text>
            <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
              {!activeClubId && isAdmin ? "General Events" : "Events"}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl px-4 h-14">
            <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search events..."
              placeholderTextColor="#9ca3af"
              className="flex-1 ml-3 text-base text-foreground dark:text-dark-fg"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {canManage && (
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="w-14 h-14 bg-primary dark:bg-dark-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
            >
              <MaterialCommunityIcons name="plus" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>

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

      {(activeClubId || isAdmin) && (
        <CreateEventModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          clubId={activeClubId}
        />
      )}
    </SafeAreaView>
  );
}
