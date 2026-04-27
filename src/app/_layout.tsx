import "@/global.css";
import { api } from "@/src/api/api";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { ClubProvider } from "@/src/contexts/ClubContext";
import { registerForPushNotificationsAsync } from "@/src/helpers/pushNotifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { toastConfig } from "../components/common/ToastConfig";

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function InitialLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated. Attempting to get push token...");
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          console.log("Sending Push Token to Backend API...");

          api
            .post("/user/push-token", { push_token: token })
            .then((response) => {
              console.log(
                "Backend successfully saved the push token!",
                response.data,
              );
            })
            .catch((err) => {
              console.error(
                "Backend rejected the push token!",
                err?.response?.data || err.message,
              );
            });
        } else {
          console.log("No token returned from helper function.");
        }
      });
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(
          "[FOREGROUND] Notification received while app is open:",
          notification.request.content,
        );
      });

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[TAPPED] User tapped the notification!");
        const data = response.notification.request.content.data;
        console.log("Payload data attached to notification:", data);

        router.push("/profile/notifications" as any);
      });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  // 3. Handle Authentication Routing rules
  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isIndexRoute = segments.length === 0;

    if (!isAuthenticated) {
      if (!inAuthGroup && !isIndexRoute) {
        router.replace("/(auth)/login");
      }
    } else if (isAuthenticated && user) {
      if (inAuthGroup || isIndexRoute) {
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

  if (isLoading || !rootNavigationState?.key) {
    return (
      <View className="flex-1 bg-background dark:bg-dark-bg items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "simple_push",
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
