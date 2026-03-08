import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileOptionProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

export const ProfileOption = ({
  icon: Icon,     
  title,
  subtitle,
  showArrow = true,
  onPress,
}: ProfileOptionProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="flex-row items-center justify-between p-4 rounded-2xl bg-card dark:bg-dark-card mb-3"
    >
      <View className="flex-row items-center gap-4">
        <View className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <Icon size={22} color="#2563EB" />
        </View>
        <View>
          <Text className="text-foreground dark:text-dark-fg font-semibold text-base">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-muted-fg dark:text-dark-muted-fg text-xs">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );
};
