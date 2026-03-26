import { api } from "@/src/api/api";
import VerifyEmailModal from "@/src/components/auth/VerifyEmailModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import LoginScreen, { LoginErrors } from "@/src/screens/auth/LoginScreen";
import { authService } from "@/src/services/authService";
import { LoginPayload } from "@/src/types/auth";
import { AuthScreen } from "@/src/types/navigation";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Alert, View } from "react-native";

const Login = () => {
  const router = useThrottledRouter();
  const { signIn } = useAuth();
  const { promptGoogleAuth } = useGoogleAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<LoginErrors>({});

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (data) => {
      setErrors({});
      await signIn(data.token, data.user);

      if (data.user.role === "admin") {
        router.replace("/(tabs)/(admin)/dashboard");
      } else {
        router.replace("/(tabs)/(user)/dashboard");
      }
    },
    onError: (error: any, variables: LoginPayload) => {
      if (!error.response) {
        setErrors({ general: "Network error. Please try again." });
        return;
      }

      const status = error.response.status;
      const data = error.response.data;

      if (status === 403) {
        setUnverifiedEmail(variables.email);
        return;
      }

      if (status === 422 && data?.errors) {
        const parsedErrors: LoginErrors = {};
        for (const key in data.errors) {
          const fieldError = data.errors[key];
          parsedErrors[key] = Array.isArray(fieldError)
            ? fieldError[0]
            : fieldError;
        }
        setErrors(parsedErrors);
        return;
      }

      if (status === 401) {
        setErrors({ general: data?.message || "Invalid Email or Password." });
        return;
      }

      setErrors({ general: data?.message || "An unexpected error occurred." });
    },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const token = await promptGoogleAuth("login");

    if (token) {
      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const user = await authService.getUser();
        await signIn(token, user);

        if (user.role === "admin") {
          router.replace("/(tabs)/(admin)/dashboard");
        } else {
          router.replace("/(tabs)/(user)/dashboard");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user profile from Google.");
      }
    }
    setIsGoogleLoading(false);
  };

  return (
    <View className="flex-1">
      <LoginScreen
        onLogin={(data) => {
          setErrors({});
          mutation.mutate(data);
        }}
        isLoading={mutation.isPending || isGoogleLoading}
        onNavigate={(screen: AuthScreen) => router.push(`/${screen}`)}
        onGoogleLogin={handleGoogleLogin}
        errors={errors}
        setErrors={setErrors}
      />

      <VerifyEmailModal
        email={unverifiedEmail}
        visible={!!unverifiedEmail}
        onClose={() => setUnverifiedEmail(null)}
      />
    </View>
  );
};

export default Login;
