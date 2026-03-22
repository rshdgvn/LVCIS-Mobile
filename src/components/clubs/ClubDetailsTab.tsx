import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const ClubDetailsTab = ({ description }: { description?: string | null }) => (
  <View className="border border-gray-200 dark:border-gray-800 rounded-2xl p-5 bg-white dark:bg-gray-900 shadow-sm">
    <View className="flex-row items-center mb-3">
      <View className="bg-blue-600 rounded-full w-6 h-6 items-center justify-center mr-3">
        <Ionicons name="information" size={16} color="white" />
      </View>
      <Text className="text-sm font-bold text-gray-900 dark:text-white">
        About the club
      </Text>
    </View>
    <Text className="text-gray-500 dark:text-gray-400 text-sm leading-6">
      {description || "No description provided for this club yet."}
    </Text>
  </View>
);