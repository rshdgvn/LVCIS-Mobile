import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";

interface Props {
  onNavigate: (screen: "login" | "register") => void;
}

export default function MainScreen({ onNavigate }: Props) {
  const { gradientTop, gradientBottom, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-[1.3] w-full">
        <ImageBackground
          source={require("../../assets/lv-building.jpg")}
          className="flex-1"
          resizeMode="cover"
          imageStyle={{ opacity: isDark ? 0.4 : 0.4 }}
        >
          <LinearGradient
            colors={[gradientTop, gradientBottom]}
            style={{ flex: 1 }}
            locations={[0.8, 0.95]}
          />
        </ImageBackground>
      </View>

      <View
        className="flex-1 px-8 justify-between"
        style={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="items-center mt-8">
          <Text className="text-foreground dark:text-dark-fg text-4xl font-bold text-center leading-tight">
            Welcome to <Text className="text-primary">LVCIS</Text>
          </Text>

          <Text className="text-muted-fg dark:text-dark-muted-fg text-lg text-center mt-4 leading-6">
            Everything your student organization needs in one easy platform.
          </Text>
        </View>

        <View className="gap-5 mb-16">
          <Pressable
            className="bg-primary h-14 rounded-xl items-center justify-center shadow-md active:opacity-90"
            onPress={() => onNavigate("register")}
          >
            <Text className="text-white font-bold text-lg">Get Started</Text>
          </Pressable>
          {/* <Pressable
            className="h-12 items-center justify-center active:opacity-60 flex-row"
            onPress={() => onNavigate("login")}
          >
            <Text className="text-muted-fg dark:text-dark-muted-fg font-medium text-base">
              I already have an account?{" "}
            </Text>
            <Text className="text-primary font-bold text-base">Login</Text>
          </Pressable> */}
          <Pressable
            onPress={() => onNavigate("login")}
            className="border border-border dark:border-dark-border h-14 rounded-xl items-center justify-center flex-row active:bg-muted dark:active:bg-dark-muted mb-4"
          >
            <Text className="font-bold text-lg text-secondary-fg dark:text-dark-secondary-fg">
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
