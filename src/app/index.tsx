import { useAuth } from "@/src/contexts/AuthContext";
import MainScreen from "@/src/screens/public/MainScreen";
import { CustomSplashScreen } from "@/src/screens/public/SplashScreen";
import { AuthScreen } from "@/src/types/navigation";
import { AnimatePresence, MotiView } from "moti";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useThrottledRouter } from "../hooks/useThrottledRouter";

export default function App() {
  const router = useThrottledRouter();
  const [isSplashVisible, setSplashVisible] = useState(true);

  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.role === "admin") {
        router.replace("/(tabs)/(admin)/dashboard");
      } else {
        router.replace("/(tabs)/(user)/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  const onNavigate = (screen: AuthScreen) => {
    router.push(`/${screen}`);
  };

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <AnimatePresence>
        {isSplashVisible && (
          <MotiView
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 500 }}
            className="absolute inset-0 z-50"
          >
            <CustomSplashScreen onComplete={() => setSplashVisible(false)} />
          </MotiView>
        )}
      </AnimatePresence>

      {!isSplashVisible && (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 400 }}
          className="flex-1"
        >
          <MainScreen onNavigate={onNavigate} />
        </MotiView>
      )}
    </View>
  );
}
