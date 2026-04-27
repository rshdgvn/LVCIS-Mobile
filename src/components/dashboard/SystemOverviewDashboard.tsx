import { useAdminDashboard } from "@/src/hooks/useDashboard";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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
  const { clubs, engagement, trend, stats, isLoading } = useAdminDashboard();
  const { primaryColor, mutedFgColor, isDark } = useTheme();

  // --- State for Scroll Indicator ---
  const [bottomActiveIndex, setBottomActiveIndex] = useState(0);

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

  // --- Scroll Handler for dynamic indicators ---
  const handleBottomScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Card width (280) + gap (16) = 296
    const index = Math.round(offsetX / 296);
    setBottomActiveIndex(Math.min(Math.max(index, 0), 1));
  };

  return (
    <View className="gap-6 mb-10">
      {/* Top Stats Row */}
      <View className="px-6 flex-row gap-4">
        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Ionicons name="school" size={20} color={primaryColor} />
          </View>
          <Text className="text-3xl font-bold text-foreground dark:text-dark-fg mb-1">
            {clubs?.total || 0}
          </Text>
          <Text className="text-[11px] font-bold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider mb-2">
            Total Clubs
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="trending-up" size={14} color={primaryColor} />
            <Text className="text-primary dark:text-dark-primary text-xs font-semibold ml-1">
              {clubs?.trend_text || "Stable"}
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border">
          <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Ionicons name="pulse" size={20} color={primaryColor} />
          </View>
          <Text className="text-3xl font-bold text-foreground dark:text-dark-fg mb-1">
            {engagePercent}%
          </Text>
          <Text className="text-[11px] font-bold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider mb-2">
            Engagement
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="analytics" size={14} color={primaryColor} />
            <Text className="text-primary dark:text-dark-primary text-xs font-semibold ml-1">
              {engagement?.trend_text || "Stable"}
            </Text>
          </View>
        </View>
      </View>

      {/* Network Overview (Styled to match "My Standing") */}
      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border flex-row items-center justify-between">
          <View>
            <Text className="text-muted-fg dark:text-dark-muted-fg font-bold uppercase text-[10px] tracking-widest mb-1">
              Network Overview
            </Text>
            <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
              {stats?.overview.total_real_students || 0}
            </Text>
            <Text className="text-primary dark:text-dark-primary text-xs font-medium mt-1">
              Registered Students
            </Text>
          </View>
          <View className="h-12 w-px bg-border dark:bg-dark-border mx-4" />
          <View>
            <Text className="text-muted-fg dark:text-dark-muted-fg font-bold uppercase text-[10px] tracking-widest mb-1">
              Active Pipeline
            </Text>
            <Text className="text-foreground dark:text-dark-fg text-3xl font-bold">
              {stats?.overview.active_events || 0}
            </Text>
            <Text className="text-primary dark:text-dark-primary text-xs font-medium mt-1">
              Upcoming Events
            </Text>
          </View>
        </View>
      </View>

      {/* Demographics & Activity Section - Decompressed and Scrollable */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          onScroll={handleBottomScroll}
          scrollEventThrottle={16}
          snapToInterval={296}
          decelerationRate="fast"
        >
          <View className="w-[280px] bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border items-center">
            <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4 w-full text-left">
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

          <View className="w-[280px] bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border items-center">
            <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4 w-full text-left">
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
        </ScrollView>

        {/* Dynamic Bottom Scroll Indicator */}
        <View className="flex-row items-center justify-center mt-3">
          <Ionicons name="chevron-back" size={14} color="#9ca3af" />
          <View className="flex-row gap-1 mx-2">
            {[0, 1].map((i) => (
              <View
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  bottomActiveIndex === i
                    ? "bg-primary dark:bg-dark-primary"
                    : "bg-primary/40 dark:bg-dark-primary/40"
                }`}
              />
            ))}
          </View>
          <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
        </View>
      </View>

      {/* Global Attendance Trend */}
      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-1">
            Global Attendance Trend
          </Text>
          <Text className="text-sm font-medium text-muted-fg dark:text-dark-muted-fg mb-8">
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
  return (
    <View className="flex-row items-center gap-2">
      <View
        style={{ backgroundColor: color }}
        className="w-2.5 h-2.5 rounded-full"
      />
      <Text className="text-xs font-medium text-foreground dark:text-dark-fg opacity-80">
        {label}
      </Text>
    </View>
  );
};
