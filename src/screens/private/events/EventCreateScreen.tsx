import React, { useState } from "react";
import { 
  View, Text, ScrollView, TouchableOpacity, 
  KeyboardAvoidingView, Platform, TextInput 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/src/components/common/BackButton";
import { useTheme } from "@/src/hooks/useTheme";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  isCreating: boolean;
  onBack: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

export default function EventCreateScreen({ isCreating, onBack, onSubmit }: Props) {
  const { mutedFgColor } = useTheme();
  
  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("event_date", date); // Expected: YYYY-MM-DD
    formData.append("event_time", time); // Expected: HH:MM
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

    // Default required fields for backend validation
    formData.append("club_id", "1");
    formData.append("purpose", "General Event");
    formData.append("status", "upcoming");
    formData.append("organizer", "Admin");
    formData.append("contact_person", "Admin");
    formData.append("contact_email", "admin@cis.com");
    formData.append("event_mode", "face_to_face");
    formData.append("duration", "2 hours");

    await onSubmit(formData);
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        
        {/* Header matching ClubCreateScreen */}
        <View className="flex-row items-center px-5 py-4">
          <BackButton onPress={onBack} />
          <Text className="flex-1 text-center text-lg font-semibold text-muted-fg dark:text-dark-muted-fg mr-10">
            Create Event
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}>
          <View className="px-5 space-y-5">
            
            <TouchableOpacity onPress={pickImage} className="w-full h-40 border border-dashed border-primary dark:border-dark-primary rounded-xl items-center justify-center bg-background dark:bg-dark-input mb-4">
              {coverImage ? (
                <Text className="text-primary dark:text-dark-primary font-bold">Image Selected</Text>
              ) : (
                <View className="items-center">
                  <Ionicons name="images-outline" size={30} color={mutedFgColor} />
                  <Text className="text-muted-fg dark:text-dark-muted-fg mt-2">Upload Cover Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">Event Title</Text>
              <TextInput value={title} onChangeText={setTitle} placeholder="Enter event name" placeholderTextColor={mutedFgColor} className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base" />
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-foreground dark:text-dark-fg text-sm mb-2">Date (YYYY-MM-DD)</Text>
                <TextInput value={date} onChangeText={setDate} placeholder="2026-12-01" placeholderTextColor={mutedFgColor} className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base" />
              </View>
              <View className="flex-1">
                <Text className="text-foreground dark:text-dark-fg text-sm mb-2">Time (HH:MM)</Text>
                <TextInput value={time} onChangeText={setTime} placeholder="14:30" placeholderTextColor={mutedFgColor} className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base" />
              </View>
            </View>

            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">Venue</Text>
              <TextInput value={venue} onChangeText={setVenue} placeholder="e.g. Main Hall" placeholderTextColor={mutedFgColor} className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base" />
            </View>

            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">Description</Text>
              <TextInput value={description} onChangeText={setDescription} placeholder="Write a short description..." placeholderTextColor={mutedFgColor} multiline numberOfLines={4} textAlignVertical="top" className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base h-32" />
            </View>

          </View>
        </ScrollView>

        {/* Footer matching ClubCreateScreen */}
        <View className="px-5 py-4 border-t border-border dark:border-dark-border">
          <TouchableOpacity onPress={handleSave} disabled={isCreating} className={`py-4 rounded-xl items-center bg-primary dark:bg-dark-primary ${isCreating ? "opacity-50" : "opacity-100"}`}>
            <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
              {isCreating ? "Creating..." : "Create Event"}
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}