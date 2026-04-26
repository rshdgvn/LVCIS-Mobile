import { Tab } from "@/src/types/tab";
import { CalendarDays, CheckSquare, Home, Users } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

interface BottomNavProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

const ACTIVE_COLOR = "#3b82f6";
const INACTIVE_COLOR = "#64748b";

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  const tabs: { name: Tab; Icon: any; ActiveIcon?: any }[] = [
    { name: "Home", Icon: Home, ActiveIcon: Home },
    { name: "Attendance", Icon: CheckSquare },
    { name: "Clubs", Icon: Users },
    { name: "Events", Icon: CalendarDays },
  ];

  const containerPadding = Platform.OS === "ios" ? "pb-8" : "pb-2";

  return (
    <View
      className={`flex-row bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border px-2 justify-between items-center ${containerPadding}`}
    >
      {tabs.map(({ name, Icon }) => {
        const isActive = activeTab === name;
        const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

        return (
          <Pressable
            key={name}
            className="flex-1 items-center justify-center pt-2 relative"
            onPress={() => onTabPress(name)}
          >
            {isActive && (
              <View className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-blue-500 rounded-b-md" />
            )}
            <Icon size={22} color={color} strokeWidth={isActive ? 2.5 : 1.75} />

            <Text
              className={`text-[10px] mt-1 ${
                isActive
                  ? "text-blue-500 dark:text-blue-400 font-bold"
                  : "text-slate-500 dark:text-dark-muted-fg font-medium"
              }`}
            >
              {name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
