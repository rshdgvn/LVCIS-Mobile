import { useClub } from "@/src/contexts/ClubContext";
import { useEventMutations } from "@/src/hooks/useEvents";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
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
  event: Event;
}

// Parse date — handles ISO strings like "2026-01-15T00:00:00.000000Z" and "YYYY-MM-DD"
const parseDateStr = (str: string): Date => {
  if (!str) return new Date();
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  // fallback: manual YYYY-MM-DD parse (avoids timezone shift)
  const parts = str.substring(0, 10).split("-").map(Number);
  const result = new Date();
  result.setFullYear(parts[0], parts[1] - 1, parts[2]);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Parse time — handles ISO strings like "1970-01-01T14:30:00.000000Z" and "HH:MM"
const parseTimeStr = (str: string): Date => {
  if (!str) return new Date();
  // ISO string — extract HH:MM from the time portion
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const result = new Date();
      result.setHours(d.getUTCHours(), d.getUTCMinutes(), 0, 0);
      return result;
    }
  }
  // "HH:MM" or "HH:MM:SS"
  const [h, m] = str.split(":").map(Number);
  const result = new Date();
  result.setHours(h, m, 0, 0);
  return result;
};

export const EditEventModal = ({ isVisible, onClose, event }: Props) => {
  const { updateEvent, isUpdating } = useEventMutations();
  const { activeClubId } = useClub();

  const [title, setTitle] = useState(event.title);
  const [venue, setVenue] = useState(event.detail?.venue || "");
  const [description, setDescription] = useState(event.description || "");
  const [coverImage, setCoverImage] = useState<string | null>(
    event.cover_image || null,
  );

  const [dateObj, setDateObj] = useState<Date>(
    parseDateStr(event.detail?.event_date || ""),
  );
  const [timeObj, setTimeObj] = useState<Date>(
    parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTitle(event.title);
      setVenue(event.detail?.venue || "");
      setDescription(event.description || "");
      setCoverImage(event.cover_image || null);
      setDateObj(parseDateStr(event.detail?.event_date || ""));
      setTimeObj(parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""));
    }
  }, [event, isVisible]);

  const isFormValid = title.trim() !== "" && venue.trim() !== "";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleClose = () => {
    setTitle(event.title);
    setVenue(event.detail?.venue || "");
    setDescription(event.description || "");
    setCoverImage(event.cover_image || null);
    setDateObj(parseDateStr(event.detail?.event_date || ""));
    setTimeObj(parseTimeStr(event.detail?.event_time?.substring(0, 5) || ""));
    onClose();
  };
  const handleUpdate = async () => {
    if (!event?.id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Event ID is missing.",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("event_date", dateObj.toISOString().split("T")[0]);
    formData.append(
      "event_time",
      `${timeObj.getHours().toString().padStart(2, "0")}:${timeObj.getMinutes().toString().padStart(2, "0")}`,
    );
    formData.append("venue", venue);
    formData.append("description", description || "N/A");
    formData.append("purpose", event.purpose || "General Event");
    formData.append("status", event.status || "upcoming");
    formData.append("organizer", event.detail?.organizer || "Admin");
    formData.append("contact_person", event.detail?.contact_person || "Admin");
    formData.append(
      "contact_email",
      event.detail?.contact_email || "admin@cis.com",
    );
    formData.append("event_mode", event.detail?.event_mode || "face_to_face");
    formData.append("duration", event.detail?.duration || "2 hours");

    if (event.club_id) {
      formData.append("club_id", event.club_id.toString());
    }

    if (coverImage && !coverImage.startsWith("http")) {
      const uriParts = coverImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("cover_image", {
        uri: coverImage,
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    try {
      await updateEvent.mutateAsync({ id: event.id, data: formData });
      Toast.show({ type: "success", text1: "Event updated successfully!" });
      handleClose();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error?.response?.data?.message ?? "Something went wrong.",
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end bg-black/40"
      >
        <TouchableOpacity
          className="flex-1"
          onPress={handleClose}
          activeOpacity={1}
        />

        <View className="bg-background dark:bg-dark-bg rounded-t-[40px] max-h-[90%]">
          <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full self-center mt-4 mb-2" />

          <ScrollView showsVerticalScrollIndicator={false} className="px-6">
            <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mt-4 mb-6">
              Edit Event
            </Text>

            {/* Cover Image */}
            <TouchableOpacity
              onPress={pickImage}
              className="w-full h-40 border-2 border-dashed border-border dark:border-dark-border rounded-3xl items-center justify-center bg-background dark:bg-dark-bg mb-6 overflow-hidden"
            >
              {coverImage ? (
                <Image
                  source={{ uri: coverImage }}
                  className="w-full h-full rounded-3xl"
                />
              ) : (
                <>
                  <View className="p-3 bg-background dark:bg-dark-bg rounded-2xl mb-3">
                    <Ionicons name="image-outline" size={28} color="#9ca3af" />
                  </View>
                  <Text className="font-bold text-foreground dark:text-dark-fg text-sm">
                    Upload Cover Photo
                  </Text>
                  <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg mt-1 uppercase tracking-wider">
                    PNG, JPG UP TO 10MB
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Title */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                Event Title
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. Computer Science Seminar"
                placeholderTextColor="#9ca3af"
                className="w-full px-4 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg"
              />
            </View>

            {/* Date + Time row */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                  Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center justify-between bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl px-4 py-4"
                >
                  <Text
                    className="text-foreground dark:text-dark-fg text-sm flex-1"
                    numberOfLines={1}
                  >
                    {dateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                  <Ionicons name="calendar-outline" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                  Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-row items-center justify-between bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl px-4 py-4"
                >
                  <Text className="text-foreground dark:text-dark-fg text-sm">
                    {formatTime(timeObj)}
                  </Text>
                  <Ionicons name="time-outline" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={(_, d) => {
                  setShowDatePicker(false);
                  if (d) setDateObj(d);
                }}
              />
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={timeObj}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={(_, t) => {
                  setShowTimePicker(false);
                  if (t) setTimeObj(t);
                }}
              />
            )}

            {/* Venue */}
            <View className="mb-4">
              <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                Venue
              </Text>
              <View className="relative">
                <TextInput
                  value={venue}
                  onChangeText={setVenue}
                  placeholder="Room 402, Science Building"
                  placeholderTextColor="#9ca3af"
                  className="w-full pl-12 pr-4 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg"
                />
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#9ca3af"
                  style={{ position: "absolute", left: 16, top: 18 }}
                />
              </View>
            </View>

            {/* Description */}
            <View className="mb-8">
              <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="What is this event about?"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="w-full px-4 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg h-28"
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-6 pb-10 pt-4 bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border">
            <TouchableOpacity
              onPress={handleUpdate}
              disabled={!isFormValid || isUpdating}
              className={`w-full py-4 rounded-2xl items-center ${!isFormValid || isUpdating ? "opacity-60" : "opacity-100"} bg-primary dark:bg-dark-primary`}
            >
              {isUpdating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
