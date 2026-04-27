import { BackButton } from "@/src/components/common/BackButton";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { InputField } from "@/src/components/common/InputField";
import {
  CATEGORY_LABEL_MAP,
  CATEGORY_OPTIONS,
  CATEGORY_VALUE_MAP,
} from "@/src/constants/clubOptions";
import { useTheme } from "@/src/hooks/useTheme";
import { Club, ClubCategory, ClubPayload } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
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
import Toast from "react-native-toast-message";

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
  const { bgColor } = useTheme();

  const [name, setName] = useState(club.name);
  const [category, setCategory] = useState<ClubCategory>(
    club.category as ClubCategory,
  );
  const [description, setDescription] = useState(club.description || "");
  const [logoUri, setLogoUri] = useState<string | null>(club.logo_url || null);

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Permission required",
        text2: "Permission to access camera roll is required!",
      });
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
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !category || !description.trim()) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please fill out all fields.",
      });
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
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-5 py-4">
          <BackButton onPress={onBack} />
          <Text className="flex-1 text-center text-lg font-semibold text-muted-fg dark:text-dark-muted-fg mr-10">
            Edit Club
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mt-6 mb-8">
            <View className="relative">
              <Image
                source={{ uri: logoUri || "https://via.placeholder.com/150" }}
                className="w-24 h-24 rounded-full border-2 border-border dark:border-dark-border"
              />
              <TouchableOpacity
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 bg-foreground dark:bg-dark-fg w-8 h-8 rounded-full items-center justify-center border-2 border-background dark:border-dark-bg z-10"
              >
                <Ionicons name="camera" size={18} color={bgColor} />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-foreground dark:text-dark-fg mt-4 text-center px-6">
              {club.name}
            </Text>

            <Text className="text-muted-fg dark:text-dark-muted-fg text-xs mt-1">
              • {club.approved_users_count || 0} active members
            </Text>
          </View>

          <View className="px-5 gap-y-4">
            <InputField
              label="Club Name"
              placeholder="Enter club name"
              value={name}
              onChangeText={setName}
            />

            <CustomDropdown
              label="Category"
              options={CATEGORY_OPTIONS}
              value={CATEGORY_LABEL_MAP[category] ?? category}
              onSelect={(val) => setCategory(CATEGORY_VALUE_MAP[val])}
              placeholder="Select club category"
            />

            <View className="mb-8">
              <Text className="text-sm font-medium text-card-fg dark:text-dark-card-fg mb-2">
                Club Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the mission, vision, and core activities of the club..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="border border-border dark:border-dark-border rounded-xl px-4 py-3 text-card-fg dark:text-dark-card-fg bg-background dark:bg-dark-bg min-h-[100px]"
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-5 py-4 border-t border-border dark:border-dark-border bg-background dark:bg-dark-bg">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className={`py-4 rounded-xl items-center bg-primary dark:bg-dark-primary ${
              isUpdating ? "opacity-50" : "opacity-100"
            }`}
          >
            <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
              {isUpdating ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
