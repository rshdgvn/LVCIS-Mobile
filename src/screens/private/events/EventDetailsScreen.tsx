import { BackButton } from "@/src/components/common/BackButton";
import { EditEventModal } from "@/src/components/modals/EditEventModal";
import { useTheme } from "@/src/hooks/useTheme";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  event?: Event;
  isLoading: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onEdit?: (eventId: number) => void;
  onDelete: () => void;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignee: string;
}

export default function EventDetailsScreen({
  event,
  isLoading,
  isDeleting,
  onBack,
  onDelete,
}: Props) {
  const { primaryColor } = useTheme();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Mock tasks for the UI until task management is implemented
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Crowd Control",
      completed: false,
      assignee: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: "2",
      title: "Security",
      completed: false,
      assignee: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: "3",
      title: "Finalize Keynote Speaker",
      completed: true,
      assignee: "https://i.pravatar.cc/150?u=3",
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };
  
  const { canManageClub } = useCanManageClub();
  const hasPermission = event ? canManageClub(event.club_id) : false;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background dark:bg-dark-bg">
        <ActivityIndicator size="large" color={primaryColor} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background dark:bg-dark-bg px-5">
        <Text className="text-lg text-muted-fg dark:text-dark-muted-fg">
          Event not found.
        </Text>
        <TouchableOpacity
          onPress={onBack}
          className="mt-4 py-3 px-6 bg-primary dark:bg-dark-primary rounded-xl"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { detail, title, cover_image } = event;
  const eventDate = detail?.event_date ? new Date(detail.event_date) : null;
  const monthMonth = eventDate
    ? eventDate.toLocaleString("default", { month: "short" })
    : "TBA";
  const dayDate = eventDate ? eventDate.getDate() : "--";
  const displayTime = detail?.event_time
    ? detail.event_time.substring(0, 5)
    : "TBA";

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-background dark:bg-dark-bg z-50">
        <BackButton onPress={onBack} />
        <View className="items-center">
          <Text className="text-lg font-semibold text-foreground dark:text-dark-fg">
            Event Details
          </Text>
          {event?.club?.name && (
            <View className="flex-row items-center gap-1 mt-0.5">
              <Ionicons name="people" size={11} color="#6b7280" />
              <Text
                className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium"
                numberOfLines={1}
              >
                {event.club.name}
              </Text>
            </View>
          )}
        </View>
        {hasPermission ? (
          <TouchableOpacity 
            onPress={() => setIsEditModalVisible(true)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text className="text-blue-600 font-medium">Edit</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-10" /> // Spacer to keep title centered
        )}
      </View>

      <View className="px-6 mt-4">
        <View className="relative h-56 rounded-3xl overflow-hidden bg-border dark:bg-dark-border mb-6">
          <Image
            source={{
              uri:
                cover_image ||
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40 justify-end p-6">
            <Text className="text-2xl font-bold text-white leading-tight">
              {title || "Untitled Event"}
            </Text>
          </View>
        </View>

        <View className="bg-background dark:bg-dark-bg rounded-3xl p-5 border border-border dark:border-dark-border flex-row items-center gap-4 mb-6">
          <View className="flex-col items-center justify-center bg-primary/10 dark:bg-dark-primary/10 rounded-2xl px-4 py-2 min-w-[70px]">
            <Text className="text-[10px] uppercase font-bold tracking-wider text-primary dark:text-dark-primary">
              {monthMonth}
            </Text>
            <Text className="text-xl font-black text-primary dark:text-dark-primary">
              {dayDate}
            </Text>
          </View>
          <View className="flex-1 justify-center space-y-1">
            <Text className="font-bold text-foreground dark:text-dark-fg mb-1">
              {eventDate
                ? eventDate.toLocaleDateString("en-US", { weekday: "long" })
                : "Day TBA"}
              , {displayTime}
            </Text>
            <View className="flex-row items-center gap-1">
              <Ionicons name="location" size={14} color={primaryColor} />
              <Text
                className="text-muted-fg dark:text-dark-muted-fg text-sm flex-1"
                numberOfLines={1}
              >
                {detail?.venue || "Venue TBA"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tasks Section (UI Only) */}
      <View className="flex-row items-center justify-between px-6 mb-4">
        <View className="flex-row items-center gap-2">
          <View className="p-1.5 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
            <Ionicons name="clipboard" size={20} color={primaryColor} />
          </View>
          <Text className="font-bold text-foreground dark:text-dark-fg text-lg">
            Assign Tasks
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="text-primary dark:text-dark-primary text-sm font-semibold">
            Edit Task
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="space-y-3">
          {tasks.map((task) => (
            <View
              key={task.id}
              className={`flex-row items-center justify-between p-4 rounded-2xl border mb-3 transition-all ${
                task.completed
                  ? "bg-primary/5 border-primary/20 dark:bg-dark-primary/10 dark:border-dark-primary/20"
                  : "bg-background border-border dark:bg-dark-bg dark:border-dark-border"
              }`}
            >
              <View className="flex-row items-center gap-4 flex-1">
                <TouchableOpacity onPress={() => toggleTask(task.id)}>
                  <Ionicons
                    name={
                      task.completed ? "checkmark-circle" : "ellipse-outline"
                    }
                    size={24}
                    color={task.completed ? primaryColor : "#d1d5db"}
                  />
                </TouchableOpacity>
                <Text
                  className={`font-medium ${
                    task.completed
                      ? "text-muted-fg line-through dark:text-dark-muted-fg"
                      : "text-foreground dark:text-dark-fg"
                  }`}
                >
                  {task.title}
                </Text>
              </View>
              <View className="flex-row items-center gap-3">
                <Image
                  source={{ uri: task.assignee }}
                  className="w-8 h-8 rounded-full border-2 border-background dark:border-dark-input"
                />
                <TouchableOpacity className="p-1">
                  <Ionicons name="trash-outline" size={16} color="#d1d5db" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <TouchableOpacity className="w-full py-4 rounded-2xl border-2 border-dashed border-border dark:border-dark-border flex-row items-center justify-center gap-2 mt-2">
            <Ionicons name="add" size={20} color="#9ca3af" />
            <Text className="text-muted-fg font-medium">Add Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View className="px-6 border-border dark:border-dark-border">
        <TouchableOpacity
          onPress={onDelete}
          disabled={isDeleting}
          className={`w-full py-4 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex-row items-center justify-center gap-2 mb-3 ${
            isDeleting ? "opacity-50" : "opacity-100"
          }`}
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-base">
            {isDeleting ? "Deleting..." : "Delete Event"}
          </Text>
        </TouchableOpacity>
        <Text className="text-center text-[10px] text-muted-fg uppercase tracking-widest font-bold mb-4">
          This action cannot be undone
        </Text>
      </View>

      {/* 3. Include the Edit Modal */}
      <EditEventModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        event={event}
      />
    </SafeAreaView>
  );
}
