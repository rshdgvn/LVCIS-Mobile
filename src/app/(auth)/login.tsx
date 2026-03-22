import { api } from "@/src/api/api";
import VerifyEmailModal from "@/src/components/auth/VerifyEmailModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth";
import LoginScreen from "@/src/screens/auth/LoginScreen";
import { authService } from "@/src/services/authService";
import { LoginPayload } from "@/src/types/auth";
import { AuthScreen } from "@/src/types/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";

const Login = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const { promptGoogleAuth } = useGoogleAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (data) => {
      await signIn(data.token, data.user);

      if (data.user.role === "admin") {
        router.replace("/(tabs)/(admin)/dashboard");
      } else {
        router.replace("/(tabs)/(user)/dashboard");
      }
    },
    onError: (error: any, variables: LoginPayload) => {
      const status = error.response?.status;
      const message = error.response?.data?.message || "Invalid credentials";

      if (status === 403) {
        setUnverifiedEmail(variables.email);
        return;
      }

      Alert.alert("Login Fail", message);
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
        onLogin={(data) => mutation.mutate(data)}
        isLoading={mutation.isPending || isGoogleLoading}
        onNavigate={(screen: AuthScreen) => router.push(`/${screen}`)}
        onGoogleLogin={handleGoogleLogin}
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
