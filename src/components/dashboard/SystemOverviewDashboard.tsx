import { useAdminDashboard } from "@/src/hooks/useDashboard";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export const SystemOverviewDashboard = () => {
  // 1. Fetch real data from ALL FOUR backend endpoints
  const { clubs, engagement, trend, stats, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-muted-fg dark:text-dark-muted-fg mt-4 font-medium">
          Loading comprehensive system metrics...
        </Text>
      </View>
    );
  }

  // 2. Format Data for the Charts
  const engagePercent = engagement?.percentage || 0;

  const lineChartData =
    trend?.map((item) => ({
      label: item.label,
      value: item.value,
      dataPointText: item.value.toString(),
    })) || [];

  return (
    <View className="gap-6 mb-10">
      {/* 1. HORIZONTAL QUICK STATS CARDS */}
      <View>
        <Text className="px-6 text-sm font-bold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider mb-3">
          Quick System Stats
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-6"
          contentContainerStyle={{ paddingRight: 48 }} // Leaves space at the end of the scroll
        >
          {/* Card 1: Clubs */}
          <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm w-44 mr-4">
            <View className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-500/10 items-center justify-center mb-3">
              <Ionicons name="grid" size={20} color="#3b82f6" />
            </View>
            <Text className="text-3xl font-black text-foreground dark:text-dark-fg mb-1">
              {clubs?.total || 0}
            </Text>
            <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg mb-2">
              Total Active Clubs
            </Text>
            <View className="flex-row items-center mt-auto">
              <Ionicons name="trending-up" size={14} color="#10b981" />
              <Text className="text-xs font-bold text-emerald-500 ml-1">
                {clubs?.trend_text || "+0"}
              </Text>
            </View>
          </View>

          {/* Card 2: Students */}
          <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm w-44 mr-4">
            <View className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-500/10 items-center justify-center mb-3">
              <Ionicons name="people" size={20} color="#a855f7" />
            </View>
            <Text className="text-3xl font-black text-foreground dark:text-dark-fg mb-1">
              {stats?.total_students || 0}
            </Text>
            <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg mb-2">
              Registered Students
            </Text>
          </View>

          {/* Card 3: Events */}
          <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm w-44">
            <View className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 items-center justify-center mb-3">
              <Ionicons name="calendar" size={20} color="#f97316" />
            </View>
            <Text className="text-3xl font-black text-foreground dark:text-dark-fg mb-1">
              {stats?.active_events || 0}
            </Text>
            <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg mb-2">
              Active Events
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* 2. OVERALL ENGAGEMENT PIE CHART */}
      <View className="px-6">
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-lg font-bold text-foreground dark:text-dark-fg">
                Overall Engagement
              </Text>
              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mt-0.5">
                System-wide attendance rate
              </Text>
            </View>
            <View className="bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <Text className="text-xs font-bold text-emerald-600">
                {engagement?.trend_text || "No Data"}
              </Text>
            </View>
          </View>

          <View className="items-center justify-center py-2">
            <PieChart
              data={[
                { value: engagePercent, color: "#3b82f6", focused: true }, // The active percentage
                { value: 100 - engagePercent, color: "#e2e8f0" }, // The missing percentage
              ]}
              donut
              radius={80}
              innerRadius={60}
              centerLabelComponent={() => (
                <View className="items-center justify-center">
                  <Text className="text-3xl font-black text-foreground dark:text-dark-fg">
                    {engagePercent}%
                  </Text>
                  <Text className="text-xs font-medium text-muted-fg mt-1">
                    Target: {engagement?.target || 85}%
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>

      {/* 3. MONTHLY ATTENDANCE TREND LINE CHART */}
      <View className="px-6">
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border shadow-sm">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-1">
            Attendance Trend
          </Text>
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-8">
            Total present/late members over last 6 months
          </Text>

          <View style={{ marginLeft: -10 }}>
            {lineChartData.length > 0 ? (
              <LineChart
                data={lineChartData}
                width={screenWidth - 110}
                height={180}
                thickness={3}
                color="#3b82f6"
                hideRules
                hideYAxisText
                yAxisColor="transparent"
                xAxisColor="#e2e8f0"
                textColor="#64748b"
                dataPointsColor="#3b82f6"
                dataPointsRadius={4}
                textFontSize={10}
                initialSpacing={20}
                spacing={
                  (screenWidth - 130) / Math.max(1, lineChartData.length - 1)
                }
                curved
                isAnimated
              />
            ) : (
              <View className="h-[180px] items-center justify-center">
                <Text className="text-muted-fg font-medium">
                  No attendance data available yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
