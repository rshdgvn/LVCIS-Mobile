import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import VerifyCodeScreen from "@/src/screens/auth/VerifyCodeScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert } from "react-native";

export default function VerifyCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useThrottledRouter();

  const verifyMutation = useMutation({
    mutationFn: (code: string) => authService.verifyResetCode(email, code),
    onSuccess: (data, variables) => {
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email, code: variables },
      });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Invalid or expired code.";
      Alert.alert("Error", msg);
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.sendResetCode(email),
    onSuccess: () => {
      Alert.alert("Sent!", "A new code has been sent to your email.");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Please wait before resending.";
      Alert.alert("Error", msg);
    },
  });

  return (
    <VerifyCodeScreen
      email={email}
      isLoading={verifyMutation.isPending}
      onVerify={(code) => verifyMutation.mutate(code)}
      onResend={() => resendMutation.mutate()}
    />
  );
}
