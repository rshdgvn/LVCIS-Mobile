import { BackButton } from "@/src/components/common/BackButton";
import { useTheme } from "@/src/hooks/useTheme";
import { ClubPayload } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
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
  isCreating: boolean;
  onBack: () => void;
  onSubmit: (data: ClubPayload) => Promise<void>;
}

export default function ClubCreateScreen({
  isCreating,
  onBack,
  onSubmit,
}: Props) {
  const { mutedFgColor } = useTheme();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

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

  const handleSave = async () => {
    if (!name || !category || !description) {
      Alert.alert("Missing Info", "Please fill out all fields.");
      return;
    }
    await onSubmit({ name, category, description });
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
            Create Club
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        >
          <View className="px-5 space-y-5">
            <View>
              <Text className="text-foreground dark:text-dark-fg text-sm mb-2">
                Club Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter club name"
                placeholderTextColor={mutedFgColor}
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
                <Text
                  className={
                    category
                      ? "text-foreground dark:text-dark-fg text-base"
                      : "text-muted-fg dark:text-dark-muted-fg text-base"
                  }
                >
                  {category || "Select a category"}
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
                placeholder="Write a short description..."
                placeholderTextColor={mutedFgColor}
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
            disabled={isCreating}
            className={`py-4 rounded-xl items-center bg-primary dark:bg-dark-primary ${isCreating ? "opacity-50" : "opacity-100"}`}
          >
            <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
              {isCreating ? "Creating..." : "Create Club"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
