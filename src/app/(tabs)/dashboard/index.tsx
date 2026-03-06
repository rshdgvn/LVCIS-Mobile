import { useAuth } from "@/src/contexts/AuthContext";
import React from "react";
import { Text, View } from "react-native";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <View>
      <Text>index</Text>
      <Text>Welcome, {user?.last_name}!</Text>
    </View>
  );
};

export default Dashboard;
