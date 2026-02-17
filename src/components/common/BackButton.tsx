import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ViewStyle } from "react-native";

interface Props {
  onPress: () => void;
  style?: ViewStyle;
}

export const BackButton = ({ onPress, style }: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={style}
      className="w-12 h-12 rounded-full bg-secondary dark:bg-dark-secondary items-center justify-center active:opacity-70"
    >
      <Ionicons
        name="chevron-back"
        size={24}
        className="text-foreground dark:text-dark-fg"
        color="#34323c"
      />
    </Pressable>
  );
};
