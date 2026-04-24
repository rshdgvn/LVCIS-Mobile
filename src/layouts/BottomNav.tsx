import { Tab } from "@/src/types/tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

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

  // Removed pt-4 from the container so the active line sits flush against the top border
  const containerPadding = Platform.OS === "ios" ? "pb-8" : "pb-2";

  return (
    <View
      className={`flex-row bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border px-4 justify-between items-center ${containerPadding}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;

        const iconColor = isActive ? "#2563EB" : "#9CA3AF";
        const textClass = isActive
          ? "text-[#2563EB] dark:text-blue-400 font-bold"
          : "text-[#9CA3AF] dark:text-dark-muted-fg font-medium";

        return (
          <Pressable
            key={tab.name}
            className="flex-1 items-center justify-center pt-2 relative"
            onPress={() => onTabPress(tab.name)}
          >
            {isActive && (
              <View className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-primary rounded-b-md" />
            )}

            <MaterialCommunityIcons
              name={isActive ? tab.activeIcon : tab.icon}
              size={30}
              color={iconColor}
            />
            <Text className={`text-xs ${textClass}`}>{tab.name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
