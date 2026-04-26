import { api } from "@/src/api/api";
import { useAuth } from "@/src/contexts/AuthContext";
import { useTheme } from "@/src/hooks/useTheme";
import { BottomNav } from "@/src/layouts/BottomNav";
import { Tab } from "@/src/types/tab";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { primaryColor } = useTheme();
  const { user } = useAuth();

  const insets = useSafeAreaInsets();
  const [isReady, setIsReady] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/notifications/unread-count");
      const count: number = data.unread_count ?? 0;

      setUnreadCount((prev) => {
        if (count > prev && prev >= 0) {
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
        return count;
      });
    } catch (err) {
      console.error("Failed to fetch unread count", err);
    }
  }, [user]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (!pathname.includes("notifications")) {
      fetchUnreadCount();
    }
  }, [pathname]);

  const getActiveTab = (): Tab => {
    if (pathname.includes("attendance")) return "Attendance";
    if (pathname.includes("clubs")) return "Clubs";
    if (pathname.includes("events")) return "Events";
    return "Home";
  };

  const handleTabPress = (tab: Tab) => {
    switch (tab) {
      case "Home":
        router.navigate("/dashboard");
        break;
      case "Attendance":
        router.navigate("/attendance");
        break;
      case "Clubs":
        router.navigate("/clubs");
        break;
      case "Events":
        router.navigate("/events");
        break;
    }
  };

  const handleBellPress = () => {
    router.push("/profile/notifications");
  };

  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg relative">
      <View className="flex-1">
        <Tabs
          initialRouteName="dashboard"
          backBehavior="initialRoute"
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
            animation: "shift",
          }}
        >
          <Tabs.Screen name="dashboard" />
          <Tabs.Screen name="attendance" />
          <Tabs.Screen name="clubs" />
          <Tabs.Screen name="events" />
        </Tabs>
      </View>

      {isReady && (
        <View
          className="absolute z-50"
          style={{
            top: insets.top + 16,
            right: 24,
          }}
        >
          <TouchableOpacity
            className="w-12 h-12 rounded-full bg-card dark:bg-dark-card border border-border dark:border-dark-border shadow-sm elevation-3 justify-center items-center relative"
            activeOpacity={0.8}
            onPress={handleBellPress}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color={primaryColor}
            />

            {unreadCount > 0 && (
              <Animated.View
                className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] rounded-full bg-destructive dark:bg-dark-destructive border-2 border-background dark:border-dark-bg justify-center items-center px-1"
                style={{
                  transform: [{ scale: pulseAnim }],
                }}
              >
                <Text className="text-white text-[10px] font-black tracking-tighter leading-none mt-0.5">
                  {badgeLabel}
                </Text>
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      )}

      {isReady && (
        <SafeAreaView
          edges={["bottom"]}
          style={{ backgroundColor: "transparent" }}
        >
          <BottomNav activeTab={getActiveTab()} onTabPress={handleTabPress} />
        </SafeAreaView>
      )}
    </View>
  );
}
