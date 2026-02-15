import RegisterScreen from "@/src/screens/auth/RegisterScreen";
import { useRouter } from "expo-router";
import React from "react";

const register = () => {
  const router = useRouter();
  return (
    <RegisterScreen
      onNavigate={() => {
        router.push("/(auth)/login");
      }}
    />
  );
};

export default register;
