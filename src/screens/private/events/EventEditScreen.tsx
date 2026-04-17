import { BackButton } from "@/src/components/common/BackButton";
import { InputField } from "@/src/components/common/InputField";
import { useTheme } from "@/src/hooks/useTheme";
import { Event } from "@/src/types/event";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  event: Event;
  isUpdating: boolean;
  onBack: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function EventEditScreen({ event, isUpdating, onBack, onSubmit }: Props) {
  const { bgColor, primaryColor } = useTheme();

  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.detail?.event_date || "");
  const [time, setTime] = useState(event.detail?.event_time?.substring(0, 5) || "");
  const [venue, setVenue] = useState(event.detail?.venue || "");
  const [description, setDescription] = useState(event.description || "");
  const [coverUri, setCoverUri] = useState<string | null>(event.cover_image || null);

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Camera roll access is needed to change the cover photo.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Rectangular aspect ratio for events
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverUri(result.assets[0].uri);
    }
  };

 const handleSave = async () => {
    if (!title.trim() || !venue.trim() || !date.trim()) {
      Alert.alert("Missing Info", "Please fill out the required fields.");
      return;
    }

    const formData = new FormData();
    
    // 1. Core UI Fields
    formData.append("title", title);
    formData.append("event_date", date); // Ensure it's YYYY-MM-DD
    formData.append("event_time", time); // Ensure it's HH:MM
    formData.append("venue", venue);
    formData.append("description", description);
    
    // 2. Cover Image (Only append if a NEW image was selected)
    if (coverUri && !coverUri.startsWith("http")) {
      const uriParts = coverUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("cover_image", {
        uri: coverUri,
        type: `image/${fileType}`,
        name: `cover.${fileType}`,
      } as any);
    }

    formData.append("club_id", event.club_id ? event.club_id.toString() : "1");
    formData.append("purpose", event.purpose || "General Event");
    formData.append("status", event.status || "upcoming");
    formData.append("organizer", event.detail?.organizer || "Admin");
    formData.append("contact_person", event.detail?.contact_person || "Admin");
    formData.append("contact_email", event.detail?.contact_email || "admin@cis.com");
    formData.append("event_mode", event.detail?.event_mode || "face_to_face");
    formData.append("duration", event.detail?.duration || "2 hours");

    await onSubmit(formData);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB] dark:bg-dark-bg">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <View className="flex-row items-center px-5 py-4 bg-white/80 dark:bg-dark-bg/80 border-b border-gray-100 dark:border-dark-border">
          <BackButton onPress={onBack} />
          <Text className="flex-1 text-center text-lg font-semibold text-gray-800 dark:text-dark-fg mr-10">
            Edit Event
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Editable Cover Image */}
          <View className="items-center mt-6 mb-6 px-5">
            <View className="relative w-full h-48 rounded-3xl overflow-hidden bg-gray-200">
              <Image
                source={{ uri: coverUri || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800" }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/30" /> {/* Dark overlay */}
              <TouchableOpacity
                onPress={handlePickImage}
                className="absolute top-1/2 left-1/2 -ml-6 -mt-6 bg-white dark:bg-dark-fg w-12 h-12 rounded-full items-center justify-center shadow-lg"
              >
                <Ionicons name="camera" size={24} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          </View>
          <View className="px-5 gap-y-4">
            <InputField label="Event Title" placeholder="Enter event name" value={title} onChangeText={setTitle} />
            <View className="flex-row gap-4">
              <View className="flex-1">
                <InputField label="Date (YYYY-MM-DD)" placeholder="2026-10-24" value={date} onChangeText={setDate} />
              </View>
              <View className="flex-1">
                <InputField label="Time (HH:MM)" placeholder="14:30" value={time} onChangeText={setTime} />
              </View>
            </View>
            <InputField label="Venue" placeholder="Enter location" value={venue} onChangeText={setVenue} />
            <InputField
              label="Description"
              placeholder="Event details..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              containerStyles="h-32"
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
        <View className="px-5 py-4 border-t border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className={`py-4 rounded-xl items-center bg-blue-600 dark:bg-blue-600 ${isUpdating ? "opacity-50" : "opacity-100"}`}
          >
            <Text className="text-white font-bold text-lg">
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}