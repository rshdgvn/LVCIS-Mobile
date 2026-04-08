import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import RegisterScreen, {
  RegisterErrors,
} from "@/src/screens/auth/RegisterScreen";
import { authService } from "@/src/services/authService";
import { RegisterPayload } from "@/src/types/auth";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

const Register = () => {
  const router = useThrottledRouter();
  const { promptGoogleAuth } = useGoogleAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const mutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: (data) => {
      setErrors({});

      Toast.show({
        type: "success",
        text1: "Account Created! Please verify your email.",
      });

      router.push("/(auth)/login");
    },
    onError: (error: any) => {
      console.error("Registration Error:", error);

      if (!error.response) {
        setErrors({ general: "Network error. Please try again." });
        return;
      }

      const status = error.response.status;
      const data = error.response.data;

      if (status === 422 && data?.errors) {
        const parsedErrors: RegisterErrors = {};
        for (const key in data.errors) {
          const fieldError = data.errors[key];
          const errorMessage = Array.isArray(fieldError)
            ? fieldError[0]
            : fieldError;

          if (key === "first_name") parsedErrors.firstname = errorMessage;
          else if (key === "last_name") parsedErrors.lastname = errorMessage;
          else parsedErrors[key as keyof RegisterErrors] = errorMessage;
        }
        setErrors(parsedErrors);
        return;
      }

      setErrors({
        general: data?.message || "Registration failed. Please try again.",
      });

      Toast.show({
        type: "error",
        text1: data?.message || "Registration failed. Please try again.",
      });
    },
  });

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    await promptGoogleAuth("signup");
    setIsGoogleLoading(false);
    router.push("/(auth)/login");
  };

  return (
    <RegisterScreen
      isLoading={mutation.isPending || isGoogleLoading}
      onRegister={(data) => {
        setErrors({});
        mutation.mutate(data);
      }}
      onNavigate={() => router.push("/(auth)/login")}
      onGoogleRegister={handleGoogleRegister}
      errors={errors}
      setErrors={setErrors}
    />
  );
};

export default Register;
