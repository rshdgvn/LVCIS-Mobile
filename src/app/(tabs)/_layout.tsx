import { BottomNav } from "@/src/layouts/BottomNav";
import { Tab } from "@/src/types/tab";
import { Stack, usePathname, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const hideNavRoutes = [
    "/profile",
    "/profile/edit-profile",
    "/profile/change-password",
    "/profile/notifications",
  ];

  const shouldHideNav = hideNavRoutes.some((route) => pathname.includes(route));

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
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-1">
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "fade",
          }}
        />
      </View>

      {!shouldHideNav && (
        <BottomNav activeTab={getActiveTab()} onTabPress={handleTabPress} />
      )}
    </View>
  );
}
