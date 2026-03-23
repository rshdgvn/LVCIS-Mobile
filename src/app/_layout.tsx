import "@/global.css";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

const queryClient = new QueryClient();

function InitialLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAdminRoute = segments[0] === "(tabs)" && segments[1] === "(admin)";

    const timer = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace("/(auth)/login");
      } else if (isAuthenticated && user) {
        if (inAuthGroup) {
          if (user.role === "admin") {
            router.replace("/(tabs)/(admin)/dashboard");
          } else {
            router.replace("/(tabs)/(user)/dashboard");
          }
        } else if (user.role !== "admin" && isAdminRoute) {
          router.replace("/(tabs)/(user)/dashboard");
        }
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, isLoading, segments, router, rootNavigationState]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "none",
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
