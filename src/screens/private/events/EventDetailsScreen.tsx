import { BackButton } from "@/src/components/common/BackButton";
import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";
import { EditEventModal } from "@/src/components/modals/EditEventModal";
import { TaskModal } from "@/src/components/modals/TaskModal";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { useEventTasks, useTaskMutations } from "@/src/hooks/useTasks";
import { useTheme } from "@/src/hooks/useTheme";
import { EventTask } from "@/src/services/taskService";
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
import Toast from "react-native-toast-message";

interface Props {
  event?: Event;
  isLoading: boolean;
  isDeleting: boolean;
  onBack: () => void;
  onDelete: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  in_progress: "#3b82f6",
  completed: "#22c55e",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export default function EventDetailsScreen({
  event,
  isLoading,
  isDeleting,
  onBack,
  onDelete,
}: Props) {
  const { primaryColor } = useTheme();
  const { canManageClub } = useCanManageClub();
  const canManage = event?.club_id ? canManageClub(event.club_id) : false;

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<EventTask | null>(null);

  const [isEventDeleteDialogOpen, setIsEventDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const { data: taskData, isLoading: isLoadingTasks } = useEventTasks(
    event?.id ?? null,
  );

  const tasks = taskData?.tasks ?? [];
  const members = taskData?.members ?? [];

  const {
    createTask,
    isCreating,
    updateTask,
    isUpdating,
    updateTaskStatus,
    deleteTask,
  } = useTaskMutations(event?.id ?? null);

  const handleCreateTask = async (data: {
    title: string;
    assigned_members: number[];
  }) => {
    if (!event?.id) return;
    try {
      await createTask({
        event_id: event.id,
        title: data.title,
        status: "pending",
        assigned_members: data.assigned_members,
      });
      Toast.show({ type: "success", text1: "Task created successfully!" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to create task." });
    }
  };

  const handleEditTask = async (data: {
    title: string;
    assigned_members: number[];
  }) => {
    if (!editingTask) return;
    try {
      await updateTask({
        id: editingTask.id,
        data: { title: data.title, assigned_members: data.assigned_members },
      });
      Toast.show({ type: "success", text1: "Task updated!" });
    } catch {
      Toast.show({ type: "error", text1: "Failed to update task." });
    }
  };

  const handleConfirmDeleteTask = async () => {
    if (taskToDelete === null) return;
    try {
      await deleteTask(taskToDelete);
      Toast.show({ type: "success", text1: "Task deleted." });
    } catch {
      Toast.show({ type: "error", text1: "Failed to delete task." });
    } finally {
      setTaskToDelete(null);
    }
  };

  const handleStatusCycle = async (task: EventTask) => {
    const cycle: Array<"pending" | "in_progress" | "completed"> = [
      "pending",
      "in_progress",
      "completed",
    ];
    const currentIndex = cycle.indexOf(task.status as any);
    const nextStatus = cycle[(currentIndex + 1) % cycle.length];
    try {
      await updateTaskStatus({ id: task.id, status: nextStatus });
    } catch {
      Toast.show({ type: "error", text1: "Failed to update status." });
    }
  };

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
  const monthStr = eventDate
    ? eventDate.toLocaleString("default", { month: "short" })
    : "TBA";
  const dayStr = eventDate ? eventDate.getDate() : "--";
  const displayTime = detail?.event_time
    ? detail.event_time.substring(0, 5)
    : "TBA";

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-dark-bg"
      edges={["top", "left", "right"]}
    >
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
        <TouchableOpacity
          onPress={() => setIsEditModalVisible(true)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Text className="text-primary dark:text-dark-primary font-medium">
            Edit
          </Text>
        </TouchableOpacity>
      </View>

      <View className="mt-4 px-4">
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
              {monthStr}
            </Text>
            <Text className="text-xl font-black text-primary dark:text-dark-primary">
              {dayStr}
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

      <View className="flex-row items-center justify-between mb-4 px-4">
        <View className="flex-row items-center gap-2">
          <View className="p-1.5 bg-primary/10 dark:bg-dark-primary/10 rounded-lg">
            <Ionicons name="clipboard" size={20} color={primaryColor} />
          </View>
          <Text className="font-bold text-foreground dark:text-dark-fg text-lg">
            Assigned Tasks
          </Text>
        </View>
      </View>
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {isLoadingTasks ? (
          <ActivityIndicator color={primaryColor} className="mt-4" />
        ) : tasks.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="clipboard-outline" size={36} color="#9ca3af" />
            <Text className="text-muted-fg dark:text-dark-muted-fg text-sm mt-2">
              No tasks yet
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task.id}
              className="flex-row items-center justify-between p-4 rounded-2xl border mb-3 bg-card dark:bg-dark-card border-border dark:border-dark-border"
            >
              <View className="flex-row items-center gap-3 flex-1">
                <TouchableOpacity
                  onPress={() => handleStatusCycle(task)}
                  disabled={!canManage}
                >
                  <Ionicons
                    name={
                      task.status === "completed"
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={24}
                    color={
                      task.status === "completed" ? primaryColor : "#d1d5db"
                    }
                  />
                </TouchableOpacity>

                <View className="flex-1">
                  <Text
                    className={`font-medium ${
                      task.status === "completed"
                        ? "text-muted-fg line-through dark:text-dark-muted-fg"
                        : "text-foreground dark:text-dark-fg"
                    }`}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor:
                          STATUS_COLORS[task.status] ?? "#9ca3af",
                      }}
                    />
                    <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
                      {STATUS_LABELS[task.status] ?? task.status}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                {task.assigned_by.slice(0, 2).map((u, i) =>
                  u.avatar ? (
                    <Image
                      key={i}
                      source={{ uri: u.avatar }}
                      className="w-7 h-7 rounded-full border border-background dark:border-dark-bg"
                      style={{ marginLeft: i > 0 ? -10 : 0 }}
                    />
                  ) : (
                    <View
                      key={i}
                      className="w-7 h-7 rounded-full bg-primary/20 items-center justify-center border border-background dark:border-dark-bg"
                      style={{ marginLeft: i > 0 ? -10 : 0 }}
                    >
                      <Text className="text-[10px] font-bold text-primary dark:text-dark-primary">
                        {u.name[0]}
                      </Text>
                    </View>
                  ),
                )}

                {canManage && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setEditingTask(task);
                        setIsTaskModalVisible(true);
                      }}
                      className="p-1"
                    >
                      <Ionicons
                        name="pencil-outline"
                        size={15}
                        color="#9ca3af"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setTaskToDelete(task.id)}
                      className="p-1"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={15}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Fixed Bottom Action Buttons */}
      <View className="px-6 py-4 bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border">
        {canManage && (
          <TouchableOpacity
            onPress={() => {
              setEditingTask(null);
              setIsTaskModalVisible(true);
            }}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-border dark:border-dark-border flex-row items-center justify-center gap-2 mb-3"
          >
            <Ionicons name="add" size={20} color="#9ca3af" />
            <Text className="text-muted-fg font-medium">Add Task</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => setIsEventDeleteDialogOpen(true)}
          disabled={isDeleting}
          className={`w-full py-4 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30 flex-row items-center justify-center gap-2 mb-2 ${
            isDeleting ? "opacity-50" : "opacity-100"
          }`}
        >
          <Ionicons name="trash" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold text-base">
            {isDeleting ? "Deleting..." : "Delete Event"}
          </Text>
        </TouchableOpacity>
      </View>

      <EditEventModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        event={event}
      />

      <TaskModal
        isVisible={isTaskModalVisible}
        onClose={() => {
          setIsTaskModalVisible(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        members={members}
        isLoading={editingTask ? isUpdating : isCreating}
        task={editingTask}
      />

      <CustomAlertDialog
        visible={isEventDeleteDialogOpen}
        title="Delete Event"
        message={`Are you sure you want to delete "${event.title || "this event"}"? This action cannot be undone.`}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => !isDeleting && setIsEventDeleteDialogOpen(false)}
        onConfirm={() => {
          setIsEventDeleteDialogOpen(false);
          onDelete();
        }}
        isDestructive={true}
        isLoading={isDeleting}
      />

      <CustomAlertDialog
        visible={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
        isDestructive={true}
      />
    </SafeAreaView>
  );
}
