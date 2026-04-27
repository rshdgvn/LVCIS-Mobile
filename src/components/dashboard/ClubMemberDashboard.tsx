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
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="gap-8 mb-10 pt-2"
    >
      {/* --- My Standing Section --- */}
      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-muted-fg dark:text-dark-muted-fg font-bold uppercase text-[10px] tracking-widest mb-1">
                My Standing
              </Text>
              <Text className="text-foreground dark:text-dark-fg text-2xl font-bold">
                {overview?.title || "Member"}
              </Text>
              <Text className="text-primary dark:text-dark-primary text-sm font-medium mt-1">
                {overview?.role || "Member"}
              </Text>
            </View>
            <View className="w-12 h-12 bg-primary/10 dark:bg-dark-primary/10 rounded-2xl items-center justify-center">
              <Ionicons name="person" size={22} color={primaryColor} />
            </View>
          </View>

          <View className="flex-row items-center bg-muted/30 dark:bg-dark-muted/20 rounded-2xl p-4">
            <View className="flex-1 pl-2">
              <Text className="text-muted-fg dark:text-dark-muted-fg text-xs font-medium mb-1">
                Attendance Rate
              </Text>
              <Text className="text-foreground dark:text-dark-fg font-bold text-lg">
                {overview?.attendance_rate || 0}%
              </Text>
            </View>
            <View className="w-px h-8 bg-border dark:bg-dark-border mx-4" />
            <View className="flex-1">
              <Text className="text-muted-fg dark:text-dark-muted-fg text-xs font-medium mb-1">
                Joined
              </Text>
              <Text className="text-foreground dark:text-dark-fg font-semibold text-sm">
                {overview?.joined_at
                  ? new Date(overview.joined_at).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* --- Upcoming Events Section --- */}
      <View className="px-6 pt-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg">
            Upcoming Events
          </Text>
          <View className="bg-primary/10 dark:bg-dark-primary/10 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-primary dark:text-dark-primary">
              {events.length}
            </Text>
          </View>
        </View>

        <View className="gap-4">
          {events.length > 0 ? (
            events.map((event) => (
              <View
                key={event.id}
                className="bg-card dark:bg-dark-card border border-border dark:border-dark-border p-5 rounded-2xl"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text
                    className="font-bold text-base text-foreground dark:text-dark-fg flex-1 mr-2"
                    numberOfLines={1}
                  >
                    {event.title}
                  </Text>
                  {event.is_ongoing && (
                    <View className="bg-primary/10 dark:bg-dark-primary/10 px-2 py-1 rounded-md flex-row items-center">
                      <View className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-dark-primary mr-1.5" />
                      <Text className="text-[10px] font-bold text-primary dark:text-dark-primary uppercase">
                        Ongoing
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#9ca3af"
                    />
                    <Text className="text-sm font-medium text-muted-fg dark:text-dark-muted-fg ml-1.5">
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "TBA"}
                    </Text>
                  </View>
                  <View className="flex-row items-center flex-1">
                    <Ionicons
                      name="location-outline"
                      size={16}
                      color="#9ca3af"
                    />
                    <Text
                      className="text-sm font-medium text-muted-fg dark:text-dark-muted-fg ml-1.5"
                      numberOfLines={1}
                    >
                      {event.venue || "TBA"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="py-6 items-center justify-center border border-dashed border-border dark:border-dark-border rounded-2xl">
              <Text className="text-center text-muted-fg dark:text-dark-muted-fg">
                No upcoming events
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* --- My Tasks Section --- */}
      <View className="px-6 pb-4 pt-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg">
            My Tasks
          </Text>
          <View className="bg-muted/30 dark:bg-dark-muted/20 px-3 py-1 rounded-full">
            <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg">
              {tasks.length}
            </Text>
          </View>
        </View>

        <View className="gap-4">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <View
                key={task.id}
                className="bg-card dark:bg-dark-card border border-border dark:border-dark-border p-5 rounded-2xl flex-row items-center"
              >
                <View className="mr-4">
                  <Ionicons
                    name={
                      task.status === "completed"
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={26}
                    color={
                      task.status === "completed" ? primaryColor : "#9ca3af"
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-base text-foreground dark:text-dark-fg mb-0.5">
                    {task.title}
                  </Text>
                  <Text className="text-xs font-medium text-muted-fg dark:text-dark-muted-fg">
                    {task.event.title}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="py-6 items-center justify-center border border-dashed border-border dark:border-dark-border rounded-2xl">
              <Text className="text-center text-muted-fg dark:text-dark-muted-fg">
                No pending tasks
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};
