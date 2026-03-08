import { useAuth } from "@/src/contexts/AuthContext";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onProfile: () => void;
}

export const DashboardScreen = ({ onProfile }: Props) => {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row items-center px-6 py-4 pr-20">
        <TouchableOpacity
          onPress={onProfile}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Image
            source={{ uri: user?.avatar }}
            className="w-14 h-14 rounded-full mr-3 bg-muted dark:bg-dark-muted"
          />
          <View className="justify-center flex-1">
            <Text className="text-md text-muted-fg dark:text-dark-muted-fg font-medium">
              Welcome,
            </Text>
            <Text
              className="text-lg text-foreground dark:text-dark-fg font-bold"
              numberOfLines={1}
            >
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center px-8">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg text-center">
          Dashboard Content
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center mt-2">
          Your personalized club information will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
};
