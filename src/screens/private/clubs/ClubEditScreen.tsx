import { BackButton } from "@/src/components/common/BackButton";
import { Club, ClubPayload } from "@/src/types/club";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  club: Club;
  isUpdating: boolean;
  onBack: () => void;
  onSubmit: (data: ClubPayload & { logoUri?: string }) => Promise<void>;
}

export default function ClubEditScreen({
  club,
  isUpdating,
  onBack,
  onSubmit,
}: Props) {
  const [name, setName] = useState(club.name);
  const [category, setCategory] = useState(club.category);
  const [description, setDescription] = useState(club.description);

  const [logoUri, setLogoUri] = useState<string | null>(club.logo_url || null);

  const handleCategoryPress = () => {
    Alert.alert("Select Category", "Choose a category:", [
      { text: "Academics", onPress: () => setCategory("Academics") },
      {
        text: "Culture & Performing Arts",
        onPress: () => setCategory("Culture & Performing Arts"),
      },
      { text: "Socio-Politics", onPress: () => setCategory("Socio-Politics") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLogoUri(result.assets[0].uri);
      console.log("aaa", logoUri);
    }
  };

  const handleSave = async () => {
    if (!name || !category || !description) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }
    await onSubmit({
      name,
      category,
      description,
      logoUri: logoUri || undefined,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-5 py-4">
          <BackButton onPress={onBack} />
          <Text className="flex-1 text-center text-lg font-semibold text-gray-500 mr-10">
            Edit Club
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="items-center mt-6 mb-8">
            <View className="relative">
              <Image
                source={{ uri: logoUri || "https://via.placeholder.com/150" }}
                className="w-24 h-24 rounded-full border-2 border-gray-200"
              />
              <TouchableOpacity
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 bg-gray-800 w-8 h-8 rounded-full items-center justify-center border-2 border-white z-10"
              >
                <Ionicons name="camera" size={14} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">
              {name}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              • {club.approved_users_count || 0} active members
            </Text>
          </View>

          <View className="px-5 space-y-5">
            <View>
              <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                Club Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="border border-blue-500 dark:border-blue-400 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 text-base"
              />
            </View>

            <View>
              <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                Category
              </Text>
              <TouchableOpacity
                onPress={handleCategoryPress}
                className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 bg-white dark:bg-gray-900 flex-row justify-between items-center"
              >
                <Text className="text-gray-900 dark:text-white text-base">
                  {category}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                Club Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-900 text-base h-32"
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className={`${isUpdating ? "bg-blue-400" : "bg-blue-600"} py-4 rounded-xl items-center`}
          >
            <Text className="text-white font-bold text-lg">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
