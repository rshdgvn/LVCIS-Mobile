import { Stack } from "expo-router";
import React from "react";

export default function ClubsRootLayout() {
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
