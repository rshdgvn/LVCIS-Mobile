import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import "../../global.css";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

const queryClient = new QueryClient();

function InitialLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAdminRoute = segments[0] === "(tabs)" && segments[1] === "admin"; 

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && user) {
      if (inAuthGroup) {
        if (user.role === "admin") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/dashboard");
        }
      } 
      else if (user.role !== "admin" && isAdminRoute) {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, user, isLoading, segments, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "fade",
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InitialLayout /> 
        </AuthProvider>
      </QueryClientProvider>
    </View>
  );
}