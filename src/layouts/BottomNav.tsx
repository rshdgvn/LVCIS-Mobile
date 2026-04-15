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
      icon: "clipboard-check-outline",
      activeIcon: "clipboard-check",
    },
    {
      name: "Clubs",
      icon: "account-group-outline",
      activeIcon: "account-group",
    },
    {
      name: "Events",
      icon: "calendar-blank-outline",
      activeIcon: "calendar-blank",
    },
  ];

  const containerPadding = Platform.OS === "ios" ? "pb-8 pt-4" : "py-4";

  return (
    <View
      className={`flex-row bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border justify-between items-center px-6 ${containerPadding}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        const iconColor = isActive ? "#2563EB" : "#9CA3AF";

        const textClass = isActive
          ? "text-[#2563EB] dark:text-blue-400 font-bold"
          : "text-[#9CA3AF] dark:text-dark-muted-fg font-medium";

        return (
          <TouchableOpacity
            key={tab.name}
            className="flex-1 items-center justify-center"
            onPress={() => onTabPress(tab.name)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={isActive ? tab.activeIcon : tab.icon}
              size={28} // Increased icon size from 24 to 28
              color={iconColor}
            />
            {/* Increased text size to xs and added slightly more margin top */}
            <Text className={`text-xs mt-1.5 ${textClass}`}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
