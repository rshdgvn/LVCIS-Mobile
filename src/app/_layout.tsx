import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { View } from "react-native";
import "../../global.css";
import { AuthProvider } from "../contexts/AuthContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <View className="flex-1 bg-background dark:bg-dark-bg">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade",
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </View>
  );
}
