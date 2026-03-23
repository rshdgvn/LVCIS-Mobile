import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export const ClubDetailsTab = ({
  description,
}: {
  description?: string | null;
}) => (
  <View className="border border-border dark:border-dark-border rounded-2xl p-5 bg-card dark:bg-dark-card shadow-sm">
    <View className="flex-row items-center mb-3">
      <View className="bg-primary dark:bg-dark-primary rounded-full w-6 h-6 items-center justify-center mr-3">
        <Ionicons name="information" size={16} color="#ffffff" />
      </View>
      <Text className="text-sm font-bold text-card-fg dark:text-dark-card-fg">
        About the club
      </Text>
    </View>
    <Text className="text-muted-fg dark:text-dark-muted-fg text-sm leading-6">
      {description || "No description provided for this club yet."}
    </Text>
  </View>
);
