import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ForgotPasswordScreen from "@/src/screens/auth/ForgotPasswordScreen";
import { authService } from "@/src/services/authService";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

export type ForgotPasswordErrors = {
  email?: string;
  general?: string;
};

export default function ForgotPassword() {
  const router = useThrottledRouter();
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});

  const mutation = useMutation({
    mutationFn: (email: string) => authService.sendResetCode(email),
    onSuccess: (data, variables) => {
      setErrors({});
      router.push({
        pathname: "/(auth)/verify-code",
        params: { email: variables },
      });
    },
    onError: (error: any) => {
      if (error.response?.status === 422) {
        const apiErrors = error.response.data.errors;
        setErrors({
          email: apiErrors?.email
            ? apiErrors.email[0]
            : "Invalid email address.",
        });
      } else {
        setErrors({
          general:
            error.response?.data?.message || "Failed to send reset link.",
        });
      }
    },
  });

  return (
    <ForgotPasswordScreen
      isLoading={mutation.isPending}
      onSendCode={(email) => {
        setErrors({});
        mutation.mutate(email);
      }}
      errors={errors}
      setErrors={setErrors}
    />
  );
}
