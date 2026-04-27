import { EventTask, TaskMember } from "@/src/services/taskService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    assigned_members: number[];
  }) => Promise<void>;
  members: TaskMember[];
  isLoading: boolean;
  task?: EventTask | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const TaskModal = ({
  isVisible,
  onClose,
  onSubmit,
  members,
  isLoading,
  task,
}: Props) => {
  const isEditing = !!task;

  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
      setTitle(task?.title || "");
      setSearch("");
      if (task && task.assigned_by.length > 0) {
        const matchedIds = members
          .filter((m) =>
            task.assigned_by.some(
              (a) =>
                `${m.user.first_name} ${m.user.last_name}`.trim() === a.name,
            ),
          )
          .map((m) => m.id);
        setSelectedIds(matchedIds);
      } else {
        setSelectedIds([]);
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [isVisible, task, members]);

  const toggleMember = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filteredMembers = members.filter((m) => {
    const name = `${m.user.first_name} ${m.user.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await onSubmit({ title: title.trim(), assigned_members: selectedIds });
    onClose();
  };

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Independent Animated Backdrop */}
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="absolute inset-0 bg-black/40"
      />

      <Pressable className="flex-1 justify-end" onPress={onClose}>
        <KeyboardAvoidingView
          behavior="padding"
        >
          <Animated.View
            style={{ transform: [{ translateY: slideAnim }] }}
            className="bg-background dark:bg-dark-bg rounded-t-3xl pt-3 px-6 max-h-[100%]"
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className="w-12 h-1.5 bg-border dark:bg-dark-border rounded-full self-center mb-5" />

              <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-5">
                {isEditing ? "Edit Task" : "New Task"}
              </Text>

              <Text className="text-sm font-medium text-muted-fg dark:text-dark-muted-fg mb-2">
                Task Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Setup tech"
                placeholderTextColor="#9ca3af"
                className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-bg mb-5"
              />

              <View className="flex-row items-center mb-3">
                <Text className="text-sm font-medium text-muted-fg dark:text-dark-muted-fg">
                  Assignee
                </Text>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg ml-2">
                  (Select one or more members)
                </Text>
              </View>

              <View className="flex-row items-center bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-xl px-3 py-2 mb-4">
                <Ionicons name="search" size={16} color="#9ca3af" />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder="Search club members"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 ml-2 text-sm text-foreground dark:text-dark-fg"
                />
              </View>

              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                columnWrapperStyle={{ gap: 8, marginBottom: 8 }}
                style={{ maxHeight: 180, marginBottom: 16 }}
                ListEmptyComponent={
                  <Text className="text-sm text-muted-fg dark:text-dark-muted-fg text-center py-4">
                    No members found
                  </Text>
                }
                renderItem={({ item }) => {
                  const isSelected = selectedIds.includes(item.id);
                  const fullName = `${item.user.first_name} ${item.user.last_name}`;
                  return (
                    <TouchableOpacity
                      onPress={() => toggleMember(item.id)}
                      className={`flex-1 flex-row items-center gap-2 px-3 py-2.5 rounded-xl border ${
                        isSelected
                          ? "bg-primary/10 border-primary/30 dark:bg-dark-primary/10 dark:border-dark-primary/30"
                          : "bg-background dark:bg-dark-bg border-border dark:border-dark-border"
                      }`}
                    >
                      {item.user.avatar ? (
                        <Image
                          source={{ uri: item.user.avatar }}
                          className="w-7 h-7 rounded-full"
                        />
                      ) : (
                        <View className="w-7 h-7 rounded-full bg-primary/20 items-center justify-center">
                          <Text className="text-xs font-bold text-primary dark:text-dark-primary">
                            {item.user.first_name[0]}
                          </Text>
                        </View>
                      )}
                      <Text
                        className={`text-xs font-medium flex-1 ${
                          isSelected
                            ? "text-primary dark:text-dark-primary"
                            : "text-foreground dark:text-dark-fg"
                        }`}
                        numberOfLines={1}
                      >
                        {fullName}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#2563EB"
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!title.trim() || isLoading}
                className={`py-4 rounded-2xl items-center mb-10 ${
                  !title.trim() || isLoading ? "opacity-60" : "opacity-100"
                } bg-primary dark:bg-dark-primary`}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    {isEditing ? "Save Changes" : "Create Task"}
                  </Text>
                )}
              </TouchableOpacity>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};