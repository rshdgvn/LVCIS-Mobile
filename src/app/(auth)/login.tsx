import LoginScreen from "@/src/screens/auth/LoginScreen";
import { useRouter } from "expo-router";
import React from "react";

const login = () => {
  const router = useRouter();
  return (
    <LoginScreen
      onNavigate={() => {
        router.push("/(auth)/register");
      }}
    />
  );
};

export default login;
