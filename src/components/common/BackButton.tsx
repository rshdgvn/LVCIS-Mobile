import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ViewStyle } from "react-native";
import { useTheme } from "@/src/hooks/useTheme";

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

export const BackButton = ({ onPress, style }: Props) => {
  const { fgColor } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={style}
      className="w-12 h-12 rounded-full bg-secondary dark:bg-dark-secondary items-center justify-center active:opacity-70"
    >
      <Ionicons
        name="chevron-back"
        size={24}
        color={fgColor}
      />
    </Pressable>
  );
};