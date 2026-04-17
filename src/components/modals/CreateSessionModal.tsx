import { useAttendanceMutations } from "@/src/hooks/useAttendance";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { InputField } from "../common/InputField";
import PrimaryButton from "../common/PrimaryButton";

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
    if (!title) {
      Toast.show({ type: "error", text1: "Title is required." });
      return;
    }

    const formattedDate = dateObj.toISOString().split("T")[0];

    createSession.mutate(
      { club_id: clubId, title, venue, date: formattedDate, is_open: true },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["sessions"] });

          Toast.show({
            type: "success",
            text1: "Session created successfully!",
          });

          setTitle("");
          setVenue("");
          setDateObj(new Date());
          onClose();
        },
        onError: (error: any) => {
          let errorMessage = "Failed to create session.";

          if (error?.response?.data) {
            const data = error.response.data;
            if (data.errors) {
              errorMessage = (Object.values(data.errors)[0] as string[])[0];
            } else if (data.error) {
              errorMessage = data.error;
            } else if (data.message) {
              errorMessage = data.message;
            }
          }

          Toast.show({
            type: "error",
            text1: "Action Failed",
            text2: errorMessage,
          });
        },
      },
    );
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-background dark:bg-dark-bg rounded-t-3xl p-6 h-3/4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-foreground dark:text-dark-fg">
              Create New Session
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2 bg-muted dark:bg-dark-muted rounded-full"
            >
              <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <InputField
              label="Session Title"
              placeholder="e.g. General Assembly"
              value={title}
              onChangeText={setTitle}
            />

            <InputField
              label="Venue"
              placeholder="e.g. Room 402"
              value={venue}
              onChangeText={setVenue}
            />

            <View className="mb-4">
              <Text className="text-sm font-medium text-foreground dark:text-dark-fg mb-2">
                Date
              </Text>
              <TouchableOpacity
                onPress={() => setShowPicker(true)}
                className="flex-row justify-between items-center bg-muted/30 dark:bg-dark-muted/30 border border-border dark:border-dark-border rounded-xl p-4 active:opacity-70"
              >
                <Text className="text-foreground dark:text-dark-fg text-base">
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
                  Platform.OS === "ios" ? "mb-4 bg-muted/20 rounded-xl p-2" : ""
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
                  themeVariant="dark"
                />
              </View>
            )}

            <View className="mt-6">
              <PrimaryButton
                title="Create Session"
                onPress={handleCreate}
                isLoading={createSession.isPending}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
