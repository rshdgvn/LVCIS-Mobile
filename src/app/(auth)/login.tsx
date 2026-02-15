import { useAuth } from "@/src/contexts/AuthContext";
import LoginScreen from "@/src/screens/auth/LoginScreen";
import { authService } from "@/src/services/authService";
import { LoginPayload } from "@/src/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

const login = () => {
  const router = useRouter();
  const { signIn } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (data) => {
      await signIn(data.token, data.user);
      router.replace("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login Error:", error);
      const message = error.response?.data?.message || "Invalid credentials";
      Alert.alert("Login Failed", message);
    },
  });

  return (
    <LoginScreen
      onLogin={(data) => mutation.mutate(data)}
      // isLoading={mutation.isPending}
      onNavigate={() => {
        router.push("/(auth)/register");
      }}
    />
  );
};

export default login;
