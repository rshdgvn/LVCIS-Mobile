import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { CircularProgress, LineChart } from "./SharedCharts";

const SYSTEM_CHART_DATA = [
  { label: "MAR", value: 55 },
  { label: "APR", value: 62 },
  { label: "MAY", value: 75 },
  { label: "JUN", value: 68 },
  { label: "JUL", value: 72 },
  { label: "AUG", value: 88 },
];

interface Props {
  clubsCount: number;
}

export const SystemOverviewDashboard = ({ clubsCount }: Props) => {
  return (
    <View className="gap-4">
      <View className="px-6 flex-row gap-4 mb-4">
        <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm justify-between">
          <View className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center mb-4">
            <Ionicons name="grid" size={20} color="#22c55e" />
          </View>
          <View>
            <Text className="text-3xl font-bold text-foreground dark:text-dark-fg mb-1">
              {clubsCount}
            </Text>
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium leading-tight">
              Total Active{"\n"}Clubs
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center justify-center">
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium mb-3 self-start">
            System Health
          </Text>
          <CircularProgress
            percent={82}
            size={76}
            strokeWidth={8}
            color="#22c55e"
          />
        </View>
      </View>
      <View className="px-6 gap-4">
        <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-1">
                Global Attendance
              </Text>
              <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium">
                Across all clubs (Last 6 mos)
              </Text>
            </View>
            <Ionicons name="earth" size={20} color="#9ca3af" />
          </View>
          <LineChart data={SYSTEM_CHART_DATA} />
        </View>
      </View>
    </View>
  );
};
