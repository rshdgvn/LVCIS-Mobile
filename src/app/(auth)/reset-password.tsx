import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ResetPasswordScreen from "@/src/screens/auth/ResetPasswordScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export type ResetErrors = {
  password?: string;
  general?: string;
};

export default function ResetPassword() {
  const { email, code } = useLocalSearchParams<{
    email: string;
    code: string;
  }>();
  const router = useThrottledRouter();
  const [errors, setErrors] = useState<ResetErrors>({});

  const mutation = useMutation({
    mutationFn: (data: { password: string; password_confirmation: string }) =>
      authService.resetPassword({
        email,
        code,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }),
    onSuccess: () => {
      setErrors({});
      Alert.alert("Success", "Your password has been reset.", [
        { text: "Log In", onPress: () => router.replace("/(auth)/login") },
      ]);
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors;
        setErrors({
          password: apiErrors?.password ? apiErrors.password[0] : undefined,
        });
      } else {
        setErrors({
          general: error.response?.data?.message || "Failed to reset password.",
        });
      }
    },
  });

  return (
    <ResetPasswordScreen
      isLoading={mutation.isPending}
      onReset={(data) => {
        setErrors({});
        mutation.mutate(data);
      }}
      errors={errors}
      setErrors={setErrors}
    />
  );
}
