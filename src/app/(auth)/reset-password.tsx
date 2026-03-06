import ResetPasswordScreen from "@/src/screens/auth/ResetPasswordScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

export default function ResetPassword() {
  const { email, code } = useLocalSearchParams<{ email: string; code: string }>();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: { password: string; password_confirmation: string }) =>
      authService.resetPassword({
        email,
        code,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }),
    onSuccess: () => {
      Alert.alert("Success", "Your password has been reset.", [
        { text: "Log In", onPress: () => router.replace("/(auth)/login") },
      ]);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to reset password.";
      Alert.alert("Error", msg);
    },
  });

  return (
    <ResetPasswordScreen
      isLoading={mutation.isPending}
      onReset={(data) => mutation.mutate(data)}
    />
  );
}