import { BackButton } from "@/src/components/common/BackButton";
import { useTheme } from "@/src/hooks/useTheme"; // Adjust path if needed
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
  const { mutedFgColor } = useTheme();
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
      const uri = result.assets[0].uri;
      setLogoUri(uri);
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
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
                <Ionicons name="camera" size={14} color="#ffffff" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-bold text-foreground dark:text-dark-fg mt-4">
              {name}
            </Text>
            <Text className="text-muted-fg dark:text-dark-muted-fg text-xs mt-1">
              • {club.approved_users_count || 0} active members
            </Text>
          </View>

          <View className="px-5 space-y-5">
            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">
                Club Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                className="border border-primary dark:border-dark-primary rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base"
              />
            </View>

            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">
                Category
              </Text>
              <TouchableOpacity
                onPress={handleCategoryPress}
                className="border border-input dark:border-dark-input rounded-xl px-4 py-3 bg-background dark:bg-dark-input flex-row justify-between items-center"
              >
                <Text className="text-foreground dark:text-dark-fg text-base">
                  {category}
                </Text>
                <Ionicons name="chevron-down" size={20} color={mutedFgColor} />
              </TouchableOpacity>
            </View>

            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">
                Club Description
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top"
                className="border border-input dark:border-dark-input rounded-xl px-4 py-3 text-foreground dark:text-dark-fg bg-background dark:bg-dark-input text-base h-32"
              />
            </View>
          </View>
        </ScrollView>

        <View className="px-5 py-4 border-t border-border dark:border-dark-border">
          <TouchableOpacity
            onPress={handleSave}
            disabled={isUpdating}
            className={`py-4 rounded-xl items-center bg-primary dark:bg-dark-primary ${isUpdating ? "opacity-50" : "opacity-100"}`}
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
