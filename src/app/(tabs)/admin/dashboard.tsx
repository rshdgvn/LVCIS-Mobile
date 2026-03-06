import { useAuth } from "@/src/contexts/AuthContext";
import React from "react";
import { Text, View } from "react-native";

const dashboard = () => {
  const { user } = useAuth();

  return (
    <View>
      <Text>dashboard</Text>
      <Text>Welcome, {user?.name}!</Text>
    </View>
  );
};

export default dashboard;
