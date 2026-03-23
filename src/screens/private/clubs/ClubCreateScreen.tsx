import { BackButton } from "@/src/components/common/BackButton";
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
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-5 py-4">
          <BackButton onPress={onBack} />
          <Text className="flex-1 text-center text-lg font-semibold text-gray-500 mr-10">
            Create Club
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
        >
          <View className="px-5 space-y-5">
            <View>
              <Text className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                Club Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter club name"
                placeholderTextColor="#9ca3af"
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
                <Text
                  className={
                    category
                      ? "text-gray-900 dark:text-white text-base"
                      : "text-gray-400 text-base"
                  }
                >
                  {category || "Select a category"}
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
                placeholder="Write a short description..."
                placeholderTextColor="#9ca3af"
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
            disabled={isCreating}
            className={`${isCreating ? "bg-blue-400" : "bg-blue-600"} py-4 rounded-xl items-center`}
          >
            <Text className="text-white font-bold text-lg">
              {isCreating ? "Creating..." : "Create Club"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
