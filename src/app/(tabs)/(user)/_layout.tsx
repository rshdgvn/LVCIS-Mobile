import { useTheme } from "@/src/hooks/useTheme";
import { BottomNav } from "@/src/layouts/BottomNav";
import { Tab } from "@/src/types/tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { primaryColor } = useTheme();

  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const getActiveTab = (): Tab => {
    if (pathname.includes("attendance")) return "Attendance";
    if (pathname.includes("clubs")) return "Clubs";
    if (pathname.includes("events")) return "Events";
    return "Home";
  };

  const handleTabPress = (tab: Tab) => {
    switch (tab) {
      case "Home":
        router.push("/(tabs)/dashboard");
        break;
      case "Attendance":
        router.push("/(tabs)/attendance");
        break;
      case "Clubs":
        router.push("/(tabs)/clubs");
        break;
      case "Events":
        router.push("/(tabs)/events");
        break;
    }
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg relative">
      <View className="flex-1">
        <Tabs
          initialRouteName="dashboard"
          backBehavior="initialRoute"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="attendance" />
          <Tabs.Screen name="clubs" />
          <Tabs.Screen name="events" />
        </Tabs>
      </View>

      {isReady && (
        <View
          className="absolute z-50"
          style={{
            top: insets.top + 16,
            right: 24,
          }}
        >
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-muted dark:bg-dark-muted justify-center items-center relative shadow-sm"
            activeOpacity={0.7}
            onPress={() => router.push("/profile/notifications")}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={primaryColor}
            />
            <View className="absolute top-2.5 right-3 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-background dark:border-dark-bg" />
          </TouchableOpacity>
        </View>
      )}

      {isReady && (
        <View
          style={{
            paddingBottom: insets.bottom,
            backgroundColor: "transparent",
          }}
        >
          <BottomNav activeTab={getActiveTab()} onTabPress={handleTabPress} />
        </View>
      )}
    </View>
  );
}
