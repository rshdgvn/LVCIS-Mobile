import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  containerStyles?: string;
}

export const InputField = ({
  label,
  isPassword = false,
  containerStyles = "",
  className,
  ...props
}: InputFieldProps) => {
  const { mutedFgColor } = useTheme();
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View className={`${containerStyles}`}>
      {label && (
        <Text className="font-semibold mb-2 text-foreground dark:text-dark-fg">
          {label}
        </Text>
      )}
      <View className="h-12 border border-input dark:border-dark-input rounded-xl px-4 flex-row items-center bg-transparent">
        <TextInput
          placeholderTextColor={mutedFgColor}
          secureTextEntry={isPassword ? isSecure : false}
          className="flex-1 text-foreground dark:text-dark-fg h-full"
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={mutedFgColor}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};
