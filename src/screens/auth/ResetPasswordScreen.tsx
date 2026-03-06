import { InputField } from "@/src/components/common/InputField";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onReset: (data: { password: string; password_confirmation: string }) => void;
  isLoading: boolean;
}

export default function ResetPasswordScreen({ onReset, isLoading }: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleReset = () => {
    if (!password || !passwordConfirmation) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }
    onReset({ password, password_confirmation: passwordConfirmation });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-8 pt-10">
      <View className="items-center mb-8 mt-10">
        <Text className="text-3xl font-medium text-foreground dark:text-dark-fg mb-3 text-center">
          Set New Password
        </Text>
        <Text className="text-muted-fg dark:text-dark-muted-fg text-center px-4 leading-5">
          Create a new, strong password for your account.
        </Text>
      </View>

      <View className="mb-4">
        <InputField
          placeholder="New password"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View className="mb-8">
        <InputField
          placeholder="Confirm new password"
          isPassword={true}
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
        />
      </View>

      <Pressable
        className={`w-full h-14 rounded-xl items-center justify-center shadow-md ${
          isLoading
            ? "bg-blue-400 dark:bg-blue-800"
            : "bg-primary dark:bg-dark-primary active:opacity-90"
        }`}
        onPress={handleReset}
        disabled={isLoading}
      >
        <Text className="text-primary-fg dark:text-dark-primary-fg font-bold text-lg">
          {isLoading ? "Updating..." : "Reset Password"}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
