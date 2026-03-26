import { ResetErrors } from "@/src/app/(auth)/reset-password";
import { InputField } from "@/src/components/common/InputField";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onReset: (data: { password: string; password_confirmation: string }) => void;
  isLoading: boolean;
  errors: ResetErrors;
  setErrors: React.Dispatch<React.SetStateAction<ResetErrors>>;
}

export default function ResetPasswordScreen({
  onReset,
  isLoading,
  errors,
  setErrors,
}: Props) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleReset = () => {
    setErrors({});
    let newErrors: ResetErrors = {};

    if (!password) {
      newErrors.password = "New password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (password !== passwordConfirmation) {
      newErrors.password = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      {errors.general && (
        <View className="bg-red-500/10 p-3 rounded-lg mb-4 border border-red-500/50">
          <Text className="text-red-500 font-medium text-center">
            {errors.general}
          </Text>
        </View>
      )}

      <View className="mb-4">
        <InputField
          placeholder="New password"
          isPassword={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
        />
      </View>

      <View className="mb-8">
        <InputField
          placeholder="Confirm new password"
          isPassword={true}
          value={passwordConfirmation}
          onChangeText={(text) => {
            setPasswordConfirmation(text);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
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
