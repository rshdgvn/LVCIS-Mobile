import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label?: string;
  isPassword?: boolean;
  containerStyles?: string;
  error?: string;
}

export const InputField = ({
  label,
  isPassword = false,
  containerStyles = "",
  error,
  className,
  ...props
}: InputFieldProps) => {
  const { mutedFgColor } = useTheme();
  const [isSecure, setIsSecure] = useState(isPassword);

  const borderClass = error
    ? "border-red-500 dark:border-red-500"
    : "border-input dark:border-dark-input";

  return (
    <View className={`${containerStyles}`}>
      {label && (
        <Text className="font-semibold mb-2 text-foreground dark:text-dark-fg">
          {label}
        </Text>
      )}
      <View
        className={`h-12 border ${borderClass} rounded-xl px-4 flex-row items-center bg-transparent`}
      >
        <TextInput
          placeholderTextColor={mutedFgColor}
          secureTextEntry={isPassword ? isSecure : false}
          className="flex-1 text-foreground dark:text-dark-fg h-full"
          {...props}
        />
        {!isPassword && error && (
          <Ionicons name="alert-circle" size={20} color="#ef4444" />
        )}
        {isPassword && (
          <Pressable onPress={() => setIsSecure(!isSecure)}>
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={error ? "#ef4444" : mutedFgColor}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
