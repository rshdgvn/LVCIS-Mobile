import { Moon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import { Switch, Text, View } from "react-native";

export function ToggleTheme() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-row items-center justify-between p-4 rounded-2xl bg-card dark:bg-dark-card mb-3">
      <View className="flex-row items-center gap-4">
        <View className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <Moon size={22} color="#2563EB" />
        </View>

        <View>
          <Text className="text-foreground dark:text-dark-fg font-semibold text-base">
            Dark Mode
          </Text>
        </View>
      </View>

      <Switch
        value={isDark}
        onValueChange={toggleColorScheme}
        trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
        thumbColor={"#ffffff"}
        ios_backgroundColor="#E5E7EB"
      />
    </View>
  );
}
