import { useRouter } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import React, { useState } from "react";
import { View } from "react-native";
import MainScreen from "../screens/MainScreen";
import { CustomSplashScreen } from "../screens/SplashScreen";
import { AuthScreen } from "../types/navigation";

export default function App() {
  const router = useRouter();
  const [isSplashVisible, setSplashVisible] = useState(true);

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
