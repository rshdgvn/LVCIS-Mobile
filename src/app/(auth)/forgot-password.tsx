import ForgotPasswordScreen from "@/src/screens/auth/ForgotPasswordScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

export default function ForgotPassword() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (email: string) => authService.sendResetCode(email),
    onSuccess: (data, variables) => {
      router.push({
        pathname: "/(auth)/verify-code",
        params: { email: variables },
      });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to send reset link.";
      Alert.alert("Error", msg);
    },
  });

  return (
    <ForgotPasswordScreen
      isLoading={mutation.isPending}
      onSendCode={(email) => mutation.mutate(email)}
    />
  );
}