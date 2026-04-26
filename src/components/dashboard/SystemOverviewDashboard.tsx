import { useAdminDashboard } from "@/src/hooks/useDashboard";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export const SystemOverviewDashboard = () => {
  const { clubs, engagement, trend, stats, isLoading } = useAdminDashboard();
  const { primaryColor, mutedFgColor, isDark } = useTheme();

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  const engagePercent = engagement?.percentage || 0;

  const lineChartData =
    trend?.map((item) => ({
      label: item.label,
      value: item.value,
      dataPointText: item.value.toString(),
    })) || [];

  const roleColors: Record<string, string> = {
    Members: "#60a5fa",
    Officers: primaryColor,
  };

  const activityColors: Record<string, string> = {
    Active: primaryColor,
    Inactive: isDark ? "#ff5252" : "#df2a1a",
  };

  const rolesPieData =
    stats?.roles_pie_chart.data.map((item) => ({
      value: item.value,
      color: roleColors[item.text] || mutedFgColor,
      text: item.text,
    })) || [];

  const activityPieData =
    stats?.activity_pie_chart.data.map((item) => ({
      value: item.value,
      color: activityColors[item.text] || mutedFgColor,
      text: item.text,
    })) || [];

  return (
    <View className="gap-6 mb-10">
      <View className="px-6 flex-row gap-4">
        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Ionicons name="school" size={20} color={primaryColor} />
          </View>
          <Text className="text-3xl font-black text-foreground dark:text-dark-fg mb-1">
            {clubs?.total || 0}
          </Text>
          <Text className="text-[11px] font-bold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider mb-2">
            Total Clubs
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="trending-up" size={14} color={primaryColor} />
            <Text className="text-primary text-xs font-semibold ml-1">
              {clubs?.trend_text || "Stable"}
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Ionicons name="pulse" size={20} color={primaryColor} />
          </View>
          <Text className="text-3xl font-black text-foreground dark:text-dark-fg mb-1">
            {engagePercent}%
          </Text>
          <Text className="text-[11px] font-bold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider mb-2">
            Engagement
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="analytics" size={14} color={primaryColor} />
            <Text className="text-primary text-xs font-semibold ml-1">
              {engagement?.trend_text || "Stable"}
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6">
        <View className="bg-primary dark:bg-dark-primary rounded-3xl p-6 shadow-lg shadow-primary/30 flex-row items-center justify-between">
          <View>
            <Text className="text-primary-fg/80 dark:text-dark-primary-fg/80 font-bold uppercase text-[10px] tracking-widest mb-1">
              Network Overview
            </Text>
            <Text className="text-primary-fg dark:text-dark-primary-fg text-3xl font-black">
              {stats?.overview.total_real_students || 0}
            </Text>
            <Text className="text-primary-fg/90 dark:text-dark-primary-fg/90 text-xs font-medium">
              Registered Students
            </Text>
          </View>
          <View className="h-12 w-px bg-primary-fg/30 mx-4" />
          <View>
            <Text className="text-primary-fg/80 dark:text-dark-primary-fg/80 font-bold uppercase text-[10px] tracking-widest mb-1">
              Active Pipeline
            </Text>
            <Text className="text-primary-fg dark:text-dark-primary-fg text-3xl font-black">
              {stats?.overview.active_events || 0}
            </Text>
            <Text className="text-primary-fg/90 dark:text-dark-primary-fg/90 text-xs font-medium">
              Upcoming Events
            </Text>
          </View>
        </View>
      </View>

      <View className="px-6 flex-row gap-4">
        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center">
          <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4">
            Demographics
          </Text>
          <PieChart
            donut
            innerRadius={25}
            radius={40}
            data={
              rolesPieData.length > 0
                ? rolesPieData
                : [{ value: 1, color: isDark ? "#33394b" : "#e9eaec" }]
            }
          />
          <View className="mt-4 w-full gap-2">
            {rolesPieData.map((item, idx) => (
              <LegendItem
                key={idx}
                color={item.color}
                label={`${item.text} (${item.value})`}
              />
            ))}
          </View>
        </View>

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center">
          <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4">
            Activity Status
          </Text>
          <PieChart
            donut
            innerRadius={25}
            radius={40}
            data={
              activityPieData.length > 0
                ? activityPieData
                : [{ value: 1, color: isDark ? "#33394b" : "#e9eaec" }]
            }
          />
          <View className="mt-4 w-full gap-2">
            {activityPieData.map((item, idx) => (
              <LegendItem
                key={idx}
                color={item.color}
                label={`${item.text} (${item.value})`}
              />
            ))}
          </View>
        </View>
      </View>

      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border shadow-sm">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-1">
            Global Attendance Trend
          </Text>
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-8">
            Total presence over last 6 months
          </Text>

          <View style={{ marginLeft: -10 }}>
            {lineChartData.length > 0 ? (
              <LineChart
                data={lineChartData}
                width={screenWidth - 110}
                height={180}
                thickness={3}
                color={primaryColor}
                hideRules
                hideYAxisText
                yAxisColor="transparent"
                xAxisColor={isDark ? "rgba(255, 255, 255, 0.1)" : "#e9eaec"}
                textColor={mutedFgColor}
                dataPointsColor={primaryColor}
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
                <Text className="text-muted-fg dark:text-dark-muted-fg font-medium">
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

const LegendItem = ({ color, label }: { color: string; label: string }) => {
  const { isDark } = useTheme();
  return (
    <View className="flex-row items-center gap-2">
      <View
        style={{ backgroundColor: color }}
        className="w-3 h-3 rounded-full"
      />
      <Text className="text-xs font-medium text-foreground dark:text-dark-fg opacity-80">
        {label}
      </Text>
    </View>
  );
};
