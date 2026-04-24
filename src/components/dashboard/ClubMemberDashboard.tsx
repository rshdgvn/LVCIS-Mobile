import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { CircularProgress } from "./SharedCharts";

interface Props {
  clubName: string;
}

export const ClubMemberDashboard = ({ clubName }: Props) => {
  return (
    <View className="gap-4 px-6">
      <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm flex-row items-center mb-4">
        <View className="flex-1">
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium mb-1">
            My Attendance Record
          </Text>
          <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
            Excellent
          </Text>
          <Text className="text-xs text-green-500 font-medium mt-1">
            You attended 8 of 10 events!
          </Text>
        </View>
        <CircularProgress
          percent={80}
          size={76}
          strokeWidth={8}
          color="#f59e0b"
        />
      </View>

      <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
        <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-4">
          Upcoming Event
        </Text>
        <View className="flex-row items-center bg-slate-50 dark:bg-dark-bg p-4 rounded-2xl border border-slate-100 dark:border-dark-border">
          <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-4">
            <Ionicons name="calendar" size={24} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-slate-800 dark:text-dark-fg text-base">
              General Assembly
            </Text>
            <Text className="text-xs text-slate-500 dark:text-dark-muted-fg mt-0.5">
              Tomorrow, 3:00 PM - Main Hall
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
