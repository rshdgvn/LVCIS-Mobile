import RegisterScreen from "@/src/screens/auth/RegisterScreen";
import { authService } from "@/src/services/authService";
import { RegisterPayload } from "@/src/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

const register = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
    onSuccess: (data) => {
      Alert.alert(
        "Account Created",
        "Please check your email to verify your account before logging in.",
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/login"),
          },
        ],
      );
    },
    onError: (error: any) => {
      console.error("Registration Error:", error);

      const errors = error.response?.data?.errors;
      let message = "Something went wrong.";

      if (errors) {
        message = Object.values(errors).flat().join("\n");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Alert.alert("Registration Failed", message);
    },
  });

  return (
    <RegisterScreen
      isLoading={mutation.isPending}
      onRegister={(data) => mutation.mutate(data)}
      onNavigate={() => {
        router.push("/(auth)/login");
      }}
    />
  );
};

export default register;
