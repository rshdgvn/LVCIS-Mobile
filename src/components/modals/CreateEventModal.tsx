import { useEventMutations } from "@/src/hooks/useEvents";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
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
}

export const CreateEventModal = ({ isVisible, onClose }: Props) => {
  const { createEvent, isCreating } = useEventMutations();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const isFormValid =
    title.trim() !== "" &&
    date.trim() !== "" &&
    time.trim() !== "" &&
    venue.trim() !== "";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setVenue("");
    setDescription("");
    setCoverImage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("event_date", date);
    formData.append("event_time", time);
    formData.append("venue", venue);
    formData.append("description", description);

    if (coverImage) {
      const uriParts = coverImage.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("cover_image", {
        uri: coverImage,
        name: `cover.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    formData.append("club_id", "1");
    formData.append("purpose", "General Event");
    formData.append("status", "upcoming");
    formData.append("organizer", "Admin");
    formData.append("contact_person", "Admin");
    formData.append("contact_email", "admin@cis.com");
    formData.append("event_mode", "face_to_face");
    formData.append("duration", "2 hours");

    try {
      await createEvent(formData);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Event created!",
      });
      handleClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create event.",
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
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

        <View className="bg-background dark:bg-dark-bg rounded-t-[40px] max-h-[83%]">
          <View className="w-12 h-1.5 bg-muted dark:bg-dark-muted rounded-full self-center mt-4 mb-2" />

          <ScrollView showsVerticalScrollIndicator={false} className="px-8">
            <View className="flex-row justify-between items-center mt-4 mb-6">
              <Text className="text-2xl font-bold text-card-fg dark:text-dark-card-fg">
                Create Event
              </Text>
            </View>

            <TouchableOpacity
              onPress={pickImage}
              className="w-full h-40 border-2 border-dashed border-border dark:border-dark-border rounded-3xl flex flex-col items-center justify-center bg-background dark:bg-dark-bg mb-8"
            >
              {coverImage ? (
                <Image
                  source={{ uri: coverImage }}
                  className="w-full h-full rounded-3xl"
                />
              ) : (
                <>
                  <View className="p-3 bg-card dark:bg-dark-card rounded-2xl shadow-sm mb-3">
                    <Ionicons name="image-outline" size={28} color="#9ca3af" />
                  </View>
                  <Text className="font-bold text-card-fg dark:text-dark-card-fg text-sm">
                    Upload Photos
                  </Text>
                  <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg font-bold tracking-widest mt-1 uppercase">
                    PNG, JPG, OR SVG UP TO 10MB
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View className="space-y-6">
              <View>
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

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Date
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={date}
                      onChangeText={setDate}
                      placeholder="mm/dd/yyyy"
                      placeholderTextColor="#9ca3af"
                      className="w-full pl-4 pr-10 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg"
                    />
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#9ca3af"
                      style={{ position: "absolute", right: 14, top: 18 }}
                    />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-muted-fg dark:text-dark-muted-fg mb-2 ml-1">
                    Time
                  </Text>
                  <View className="relative">
                    <TextInput
                      value={time}
                      onChangeText={setTime}
                      placeholder="-- : -- --"
                      placeholderTextColor="#9ca3af"
                      className="w-full pl-4 pr-10 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg"
                    />
                    <Ionicons
                      name="time-outline"
                      size={18}
                      color="#9ca3af"
                      style={{ position: "absolute", right: 14, top: 18 }}
                    />
                  </View>
                </View>
              </View>

              <View>
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

              <View className="mb-32">
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
                  className="w-full px-4 py-4 bg-background dark:bg-dark-bg border border-border dark:border-dark-border rounded-2xl text-foreground dark:text-dark-fg h-32"
                />
              </View>
            </View>
          </ScrollView>

          <View className="p-8 bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border">
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!isFormValid || isCreating}
              className={`w-full py-4 rounded-2xl items-center shadow-sm ${
                !isFormValid || isCreating
                  ? "bg-primary dark:bg-dark-primary"
                  : "bg-primary dark:bg-dark-primary"
              }`}
            >
              {isCreating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Event
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
