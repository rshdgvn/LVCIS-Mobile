import { useAttendanceMutations } from "@/src/hooks/useAttendance";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  clubId: number;
}

export const CreateSessionModal = ({ isVisible, onClose, clubId }: Props) => {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const queryClient = useQueryClient();
  const { createSession } = useAttendanceMutations();

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDateObj(selectedDate);
    }
  };

  const handleCreate = () => {
    if (!title.trim() || !venue.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fill in all required fields.",
      });
      return;
    }

    const dateStr = dateObj.toISOString().split("T")[0];

    createSession.mutate(
      {
        club_id: clubId,
        title,
        venue,
        date: dateStr,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Session Created!",
            text2: `"${title}" has been successfully created.`,
          });
          queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
          setTitle("");
          setVenue("");
          setDateObj(new Date());
          onClose();
        },
        onError: (error: any) => {
          const msg = error.response?.data?.message || "Something went wrong.";
          Toast.show({
            type: "error",
            text1: "Creation Failed",
            text2: msg,
          });
        },
      },
    );
  };

  const isFormValid = title.trim() && venue.trim();

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/40"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={onClose}
          activeOpacity={1}
        />

        <View className="bg-card dark:bg-dark-card rounded-t-[32px] p-6 max-h-[90%]">
          <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full self-center mb-6" />

          <Text className="text-xl font-bold text-card-fg dark:text-dark-card-fg mb-6">
            Create Session
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                Session Title
              </Text>
              <TextInput
                placeholder="e.g., General Assembly"
                placeholderTextColor="#9ca3af"
                value={title}
                onChangeText={setTitle}
                className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                Venue
              </Text>
              <TextInput
                placeholder="e.g., Main Hall"
                placeholderTextColor="#9ca3af"
                value={venue}
                onChangeText={setVenue}
                className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg"
              />
            </View>

            <View className="mb-8">
              <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="border border-border dark:border-dark-border rounded-xl px-4 py-3 bg-background dark:bg-dark-bg flex-row justify-between items-center"
              >
                <Text className="text-card-fg dark:text-dark-card-fg">
                  {dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            {showPicker && (
              <View
                className={
                  Platform.OS === "ios" ? "mb-6 bg-muted/20 rounded-xl p-2" : ""
                }
              >
                {Platform.OS === "ios" && (
                  <View className="flex-row justify-end mb-2">
                    <TouchableOpacity onPress={() => setShowPicker(false)}>
                      <Text className="text-primary font-bold">Done</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <DateTimePicker
                  value={dateObj}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "calendar"}
                  onChange={onChangeDate}
                />
              </View>
            )}

            <TouchableOpacity
              disabled={!isFormValid || createSession.isPending}
              onPress={handleCreate}
              className={`py-4 rounded-xl items-center ${
                !isFormValid || createSession.isPending
                  ? "bg-primary/50 dark:bg-dark-primary/50"
                  : "bg-primary dark:bg-dark-primary"
              }`}
            >
              {createSession.isPending ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Create Session
                </Text>
              )}
            </TouchableOpacity>

            <Text className="text-center text-[10px] text-muted-fg dark:text-dark-muted-fg uppercase mt-3 tracking-widest">
              This action will notify club members
            </Text>

            <View className="h-8" />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
