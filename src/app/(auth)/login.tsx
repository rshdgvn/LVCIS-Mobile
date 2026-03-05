import { useAuth } from "@/src/contexts/AuthContext";
import { useGoogleAuth } from "@/src/hooks/useGoogleAuth"; // <-- IMPORT HOOK
import LoginScreen from "@/src/screens/auth/LoginScreen";
import { authService } from "@/src/services/authService";
import { LoginPayload } from "@/src/types/auth";
import { AuthScreen } from "@/src/types/navigation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert } from "react-native";
import { api } from "@/src/api/api"; 

const Login = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const { promptGoogleAuth } = useGoogleAuth(); 
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),
    onSuccess: async (data) => {
      await signIn(data.token, data.user);
      
      if (data.user.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/dashboard");
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid credentials";
      Alert.alert("Login Failed", message);
    },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const token = await promptGoogleAuth('login');
    
    if (token) {
      try {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const user = await authService.getUser();
        await signIn(token, user);

        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user profile from Google.");
      }
    }
    setIsGoogleLoading(false);
  };

  return (
    <LoginScreen
      onLogin={(data) => mutation.mutate(data)}
      isLoading={mutation.isPending || isGoogleLoading}
      onNavigate={(screen: AuthScreen) => router.push(`/${screen}`)}
      onGoogleLogin={handleGoogleLogin} // <-- PASS PROP
    />
  );
};

export default Login;