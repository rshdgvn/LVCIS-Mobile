import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEventMutations } from "@/src/hooks/useEvents";
import Toast from "react-native-toast-message";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export const CreateEventModal = ({ isVisible, onClose }: Props) => {
  const { createEvent, isCreating } = useEventMutations();

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const isFormValid = title.trim() !== "" && date.trim() !== "" && time.trim() !== "" && venue.trim() !== "";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!result.canceled) setCoverImage(result.assets[0].uri);
  };

  // 1. Logic copied from CreateClubModal: Reset function
  const resetForm = () => {
    setTitle("");
    setDate("");
    setTime("");
    setVenue("");
    setDescription("");
    setCoverImage(null);
  };

  // 2. Logic copied from CreateClubModal: handleClose function
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

    // Backend defaults
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
      Toast.show({ type: "success", text1: "Success", text2: "Event created!" });
      handleClose(); 
    } catch (error) {
      Toast.show({ type: "error", text1: "Error", text2: "Failed to create event." });
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
        
        <View className="bg-white dark:bg-dark-bg rounded-t-[40px] max-h-[83%]">
          <View className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full self-center mt-4 mb-2" />
          
          <ScrollView showsVerticalScrollIndicator={false} className="px-8">
            <View className="flex-row justify-between items-center mt-4 mb-6">
              <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Create Event</Text>
            </View>

            {/* Upload Section */}
            <TouchableOpacity 
              onPress={pickImage}
              className="w-full h-40 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-3xl flex flex-col items-center justify-center bg-zinc-50/50 dark:bg-zinc-900/50 mb-8"
            >
              {coverImage ? (
                <Image source={{ uri: coverImage }} className="w-full h-full rounded-3xl" />
              ) : (
                <>
                  <View className="p-3 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm mb-3">
                    <Ionicons name="image-outline" size={28} color="#9ca3af" />
                  </View>
                  <Text className="font-bold text-zinc-700 dark:text-zinc-300 text-sm">Upload Photos</Text>
                  <Text className="text-[10px] text-zinc-400 font-bold tracking-widest mt-1 uppercase">PNG, JPG, OR SVG UP TO 10MB</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Form Fields */}
            <View className="space-y-6">
              <View>
                <Text className="text-xs font-bold text-zinc-500 mb-2 ml-1">Event Title</Text>
                <TextInput 
                  value={title} onChangeText={setTitle}
                  placeholder="e.g. Computer Science Seminar"
                  placeholderTextColor="#d1d5db"
                  className="w-full px-4 py-4 bg-white dark:bg-dark-input border border-zinc-100 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white"
                />
              </View>

              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs font-bold text-zinc-500 mb-2 ml-1">Date</Text>
                  <View className="relative">
                    <TextInput 
                      value={date} onChangeText={setDate}
                      placeholder="mm/dd/yyyy" placeholderTextColor="#d1d5db"
                      className="w-full pl-4 pr-10 py-4 bg-white dark:bg-dark-input border border-zinc-100 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white"
                    />
                    <Ionicons name="calendar-outline" size={18} color="#9ca3af" style={{ position: 'absolute', right: 14, top: 18 }} />
                  </View>
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-bold text-zinc-500 mb-2 ml-1">Time</Text>
                  <View className="relative">
                    <TextInput 
                      value={time} onChangeText={setTime}
                      placeholder="-- : -- --" placeholderTextColor="#d1d5db"
                      className="w-full pl-4 pr-10 py-4 bg-white dark:bg-dark-input border border-zinc-100 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white"
                    />
                    <Ionicons name="time-outline" size={18} color="#9ca3af" style={{ position: 'absolute', right: 14, top: 18 }} />
                  </View>
                </View>
              </View>

              <View>
                <Text className="text-xs font-bold text-zinc-500 mb-2 ml-1">Venue</Text>
                <View className="relative">
                  <TextInput 
                    value={venue} onChangeText={setVenue}
                    placeholder="Room 402, Science Building" placeholderTextColor="#d1d5db"
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-input border border-zinc-100 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white"
                  />
                  <Ionicons name="location-outline" size={18} color="#9ca3af" style={{ position: 'absolute', left: 16, top: 18 }} />
                </View>
              </View>

              <View className="mb-32">
                <Text className="text-xs font-bold text-zinc-500 mb-2 ml-1">Description</Text>
                <TextInput 
                  value={description} onChangeText={setDescription}
                  placeholder="What is this event about?" placeholderTextColor="#d1d5db"
                  multiline numberOfLines={4} textAlignVertical="top"
                  className="w-full px-4 py-4 bg-white dark:bg-dark-input border border-zinc-100 dark:border-dark-border rounded-2xl text-zinc-900 dark:text-white h-32"
                />
              </View>
            </View>
          </ScrollView>

          {/* Fixed Footer Button */}
          <View className="p-8 bg-white/90 dark:bg-dark-bg/90 border-t border-zinc-50 dark:border-zinc-800">
            <TouchableOpacity
              onPress={handleCreate}
              disabled={!isFormValid || isCreating}
              className={`w-full py-4 rounded-2xl items-center shadow-xl ${
                !isFormValid || isCreating ? "bg-blue-300" : "bg-blue-600 shadow-blue-200"
              }`}
            >
              {isCreating ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-lg">Create Event</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};