import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => (
    <View className="flex-row items-center bg-[#10b981] dark:bg-[#059669] px-4 py-3 rounded-xl shadow-sm mt-12 mx-4 w-[90%]">
      <View className="bg-black/10 p-1 rounded-md mr-3">
        <Ionicons name="checkmark-sharp" size={18} color="white" />
      </View>
      <Text className="text-white font-semibold flex-1">{text1}</Text>
    </View>
  ),

  error: ({ text1 }) => (
    <View className="flex-row items-center bg-[#ef4444] dark:bg-[#dc2626] px-4 py-3 rounded-xl shadow-sm mt-12 mx-4 w-[90%]">
      <View className="bg-black/10 p-1 rounded-md mr-3">
        <Ionicons name="warning-outline" size={18} color="white" />
      </View>
      <Text className="text-white font-semibold flex-1">{text1}</Text>
    </View>
  ),
};
