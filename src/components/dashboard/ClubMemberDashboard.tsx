import { useMemberDashboard } from "@/src/hooks/useDashboard";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

interface Props {
  clubId: number;
}

export const ClubMemberDashboard = ({ clubId }: Props) => {
  const { overview, tasks, events, isLoading } = useMemberDashboard(clubId);
  const { primaryColor } = useTheme();

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="gap-6 mb-10">
      <View className="px-6">
        <View className="bg-primary dark:bg-dark-primary rounded-3xl p-6 shadow-lg shadow-primary/30">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-primary-fg/80 dark:text-dark-primary-fg/80 font-bold uppercase text-[10px] tracking-widest mb-1">
                My Standing
              </Text>
              <Text className="text-primary-fg dark:text-dark-primary-fg text-2xl font-black">
                {overview?.title || "Member"}
              </Text>
              <Text className="text-primary-fg/90 dark:text-dark-primary-fg/90 text-sm opacity-80">
                {overview?.role || "Member"}
              </Text>
            </View>
            <View className="w-12 h-12 bg-primary-fg/20 dark:bg-dark-primary-fg/20 rounded-2xl items-center justify-center">
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
          </View>

          <View className="flex-row items-center bg-black/10 rounded-2xl p-4 mt-2">
            <View className="flex-1">
              <Text className="text-primary-fg/80 dark:text-dark-primary-fg/80 text-xs font-bold mb-1">
                Attendance Rate
              </Text>
              <Text className="text-primary-fg dark:text-dark-primary-fg font-black text-lg">
                {overview?.attendance_rate || 0}%
              </Text>
            </View>
            <View className="w-px h-8 bg-primary-fg/20 dark:bg-dark-primary-fg/20 mx-4" />
            <View className="flex-1">
              <Text className="text-primary-fg/80 dark:text-dark-primary-fg/80 text-xs font-bold mb-1">
                Joined
              </Text>
              <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-sm">
                {overview?.joined_at
                  ? new Date(overview.joined_at).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="px-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-black text-foreground dark:text-dark-fg">
            Upcoming Events
          </Text>
          <View className="bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-black text-primary">
              {events.length}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          {events.length > 0 ? (
            events.map((event) => (
              <View
                key={event.id}
                className="bg-card dark:bg-dark-card border border-border dark:border-dark-border p-4 rounded-2xl"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text
                    className="font-bold text-base text-foreground dark:text-dark-fg flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {event.title}
                  </Text>
                  {event.is_ongoing && (
                    <View className="bg-primary/10 px-2 py-0.5 rounded flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-primary mr-1" />
                      <Text className="text-[10px] font-bold text-primary uppercase">
                        Ongoing
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={primaryColor}
                    />
                    <Text className="text-xs text-muted-fg dark:text-dark-muted-fg ml-1">
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "TBA"}
                    </Text>
                  </View>
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={primaryColor}
                    />
                    <Text
                      className="text-xs text-muted-fg dark:text-dark-muted-fg ml-1"
                      numberOfLines={1}
                    >
                      {event.venue || "TBA"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg py-4">
              No upcoming events
            </Text>
          )}
        </View>
      </View>

      <View className="px-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-black text-foreground dark:text-dark-fg">
            My Tasks
          </Text>
          <View className="bg-accent dark:bg-dark-accent px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg">
              {tasks.length}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <View
                key={task.id}
                className="bg-card dark:bg-dark-card border border-border dark:border-dark-border p-4 rounded-2xl flex-row items-center"
              >
                <View className="mr-4">
                  <Ionicons
                    name={
                      task.status === "completed"
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={primaryColor}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-foreground dark:text-dark-fg">
                    {task.title}
                  </Text>
                  <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
                    {task.event.title}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg py-4">
              No pending tasks
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
