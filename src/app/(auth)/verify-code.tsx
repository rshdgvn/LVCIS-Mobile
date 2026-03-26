import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import VerifyCodeScreen from "@/src/screens/auth/VerifyCodeScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";

export type VerifyErrors = {
  code?: string;
  general?: string;
};

export default function VerifyCode() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useThrottledRouter();
  const [errors, setErrors] = useState<VerifyErrors>({});

  const verifyMutation = useMutation({
    mutationFn: (code: string) => authService.verifyResetCode(email, code),
    onSuccess: (_, variables) => {
      setErrors({});
      router.push({
        pathname: "/(auth)/reset-password",
        params: { email, code: variables },
      });
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Invalid or expired code.";

      if (status === 422 || status === 400) {
        setErrors({ code: msg });
      } else {
        setErrors({ general: msg });
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authService.sendResetCode(email),
    onSuccess: () => {
      setErrors({});
      Alert.alert("Sent!", "A new code has been sent to your email.");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Please wait before resending.";
      setErrors({ general: msg });
    },
  });

  return (
    <VerifyCodeScreen
      email={email}
      isLoading={verifyMutation.isPending || resendMutation.isPending}
      onVerify={(code) => {
        setErrors({});
        verifyMutation.mutate(code);
      }}
      onResend={() => {
        setErrors({});
        resendMutation.mutate();
      }}
      errors={errors}
      setErrors={setErrors}
    />
  );
}
