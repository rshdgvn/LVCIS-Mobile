import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { CircularProgress, LineChart } from "./SharedCharts";

const CLUB_CHART_DATA = [
  { label: "MAR", value: 30 },
  { label: "APR", value: 45 },
  { label: "MAY", value: 40 },
  { label: "JUN", value: 60 },
  { label: "JUL", value: 55 },
  { label: "AUG", value: 70 },
];

interface Props {
  role: string;
  clubName: string;
}

export const ClubManagerDashboard = ({ role, clubName }: Props) => {
  return (
    <View className="gap-4">
      <View className="px-6 mb-2">
        <View className="bg-blue-50 dark:bg-dark-primary/10 rounded-xl p-3 border border-blue-100 dark:border-dark-primary/30 flex-row items-center">
          <Ionicons name="information-circle" size={18} color="#3b82f6" />
          <Text className="text-blue-700 dark:text-primary text-xs font-medium ml-2">
            You are managing <Text className="font-bold">{clubName}</Text> as an{" "}
            <Text className="font-bold">{role}</Text>.
          </Text>
        </View>
      </View>

      <View className="px-6 flex-row gap-4 mb-4">
        <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm justify-between">
          <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 items-center justify-center mb-4">
            <Ionicons name="people" size={20} color="#3b82f6" />
          </View>
          <View>
            <Text className="text-3xl font-bold text-foreground dark:text-dark-fg mb-1">
              124
            </Text>
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium leading-tight">
              Total Club{"\n"}Members
            </Text>
          </View>
        </View>
        <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center justify-center">
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium mb-3 self-start">
            Club Activity
          </Text>
          <CircularProgress
            percent={64}
            size={76}
            strokeWidth={8}
            color="#3b82f6"
          />
        </View>
      </View>

      <View className="px-6 gap-4">
        <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-1">
                Club Attendance Trend
              </Text>
              <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium">
                Last 6 months
              </Text>
            </View>
            <Ionicons name="trending-up" size={20} color="#9ca3af" />
          </View>
          <LineChart data={CLUB_CHART_DATA} />
        </View>
      </View>
    </View>
  );
};
