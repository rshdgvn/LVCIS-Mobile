import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onProfile: () => void;
}

export const DashboardScreen = ({ onProfile }: Props) => {
  const { user } = useAuth();
  const { primaryColor } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-background dark:bg-dark-bg"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View className="flex-row justify-between items-center px-6 py-4">
        <TouchableOpacity
          onPress={onProfile}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Image
            source={{ uri: user?.avatar }}
            className="w-14 h-14 rounded-full mr-3 bg-muted dark:bg-dark-muted"
          />
          <View className="justify-center">
            <Text className="text-md text-muted-fg dark:text-dark-muted-fg font-medium">
              Welcome,
            </Text>
            <Text className="text-lg text-foreground dark:text-dark-fg font-bold">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted justify-center items-center relative"
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={24}
            color={primaryColor}
          />
          <View className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background dark:border-dark-bg" />
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
