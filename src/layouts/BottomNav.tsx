import { Tab } from "@/src/types/tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface BottomNavProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs: { name: Tab; icon: any; activeIcon: any }[] = [
    { name: "Home", icon: "home-outline", activeIcon: "home" },
    {
      name: "Attendance",
      icon: "account-check-outline",
      activeIcon: "account-check",
    },
    { name: "Clubs", icon: "school-outline", activeIcon: "school" },
    {
      name: "Events",
      icon: "calendar-check-outline",
      activeIcon: "calendar-check",
    },
  ];

  const containerPadding = Platform.OS === "ios" ? "pb-8 pt-3" : "py-3";

  return (
    <View
      className={`flex-row bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border justify-around items-center ${containerPadding}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        const iconColor = isActive ? "#2563EB" : "#9CA3AF";
        const textClass = isActive
          ? "text-primary dark:text-dark-primary"
          : "text-muted-fg dark:text-dark-muted-fg";

        return (
          <TouchableOpacity
            key={tab.name}
            className="flex-1 items-center justify-center"
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={iconColor}
            />
            <Text className={`text-[10px] mt-1 font-semibold ${textClass}`}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
