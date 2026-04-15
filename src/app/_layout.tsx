import "@/global.css";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ClubProvider } from "@/src/contexts/ClubContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRootNavigationState, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/common/ToastConfig";
import { useThrottledRouter } from "../hooks/useThrottledRouter";

const queryClient = new QueryClient();

function InitialLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useThrottledRouter();

  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isIndexRoute = (segments as string[]).length === 0;

    if (!isAuthenticated && !inAuthGroup && !isIndexRoute) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && user) {
      if (inAuthGroup) {
        if (user.role === "admin") {
          router.replace("/(tabs)/(admin)/dashboard");
        } else {
          router.replace("/(tabs)/(user)/dashboard");
        }
      } else if (
        user.role !== "admin" &&
        segments[0] === "(tabs)" &&
        segments[1] === "(admin)"
      ) {
        router.replace("/(tabs)/(user)/dashboard");
      }
    }
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
          <ClubProvider>
            <InitialLayout />
          </ClubProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toast config={toastConfig} />
    </View>
  );
}
