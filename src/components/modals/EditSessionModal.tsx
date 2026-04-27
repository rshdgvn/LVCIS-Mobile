import { useAttendanceMutations } from "@/src/hooks/useAttendance";
import { AttendanceSession } from "@/src/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
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
  session: AttendanceSession | null;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const EditSessionModal = ({ isVisible, onClose, session }: Props) => {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [dateObj, setDateObj] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [showModal, setShowModal] = useState(isVisible);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const queryClient = useQueryClient();
  const { updateSession } = useAttendanceMutations();

  useEffect(() => {
    if (isVisible) {
      setShowModal(true);
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
  }, [isVisible]);

  useEffect(() => {
    if (session && isVisible) {
      setTitle(session.title || "");
      setVenue(session.venue || "");
      setDateObj(session.date ? new Date(session.date) : new Date());
    }
  }, [session, isVisible]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDateObj(selectedDate);
    }
  };

  const handleUpdate = () => {
    if (!session?.id) return;
    if (!title.trim() || !venue.trim()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Title and venue are required.",
      });
      return;
    }

    const dateStr = dateObj.toISOString().split("T")[0];

    updateSession.mutate(
      {
        id: session.id,
        data: { title, venue, date: dateStr },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Session Updated!",
            text2: `"${title}" has been successfully updated.`,
          });
          queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
          queryClient.invalidateQueries({ queryKey: ["session", session.id] });
          onClose();
        },
        onError: (error: any) => {
          const msg =
            error.response?.data?.message || "Failed to update session.";
          Toast.show({
            type: "error",
            text1: "Update Failed",
            text2: msg,
          });
        },
      },
    );
  };

  const isFormValid = title.trim() && venue.trim();

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
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
            className="bg-background dark:bg-dark-bg rounded-t-[32px] p-6 max-h-[100%]"
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full self-center mb-6" />

              <Text className="text-xl font-bold text-card-fg dark:text-dark-card-fg mb-6">
                Edit Session
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
                  disabled={!isFormValid || updateSession.isPending}
                  onPress={handleUpdate}
                  className={`py-4 rounded-xl items-center ${
                    !isFormValid || updateSession.isPending
                      ? "bg-primary/50 dark:bg-dark-primary/50"
                      : "bg-primary dark:bg-dark-primary"
                  }`}
                >
                  {updateSession.isPending ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white font-bold text-base">
                      Save Changes
                    </Text>
                  )}
                </TouchableOpacity>

                <Text className="text-center text-[10px] text-muted-fg dark:text-dark-muted-fg uppercase mt-3 tracking-widest">
                  Members will see these updates immediately
                </Text>

                <View className="h-8" />
              </ScrollView>
            </Pressable>
          </Animated.View>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};