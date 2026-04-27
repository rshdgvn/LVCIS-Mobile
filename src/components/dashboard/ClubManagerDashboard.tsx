import { useManagerDashboard } from "@/src/hooks/useDashboard";
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

export const ClubManagerDashboard = ({ clubId }: { clubId: number }) => {
  const { stats, insights, trend, isLoading } = useManagerDashboard(clubId);
  const { primaryColor, mutedFgColor, isDark } = useTheme();

  // --- Added State for Scroll Indicators ---
  const [topActiveIndex, setTopActiveIndex] = useState(0);
  const [bottomActiveIndex, setBottomActiveIndex] = useState(0);

  if (isLoading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  const pipelineColors: Record<string, string> = {
    upcoming: "#93c5fd",
    ongoing: primaryColor,
    completed: "#1d4ed8",
  };

  const activityColors: Record<string, string> = {
    Active: primaryColor,
    Inactive: isDark ? "#ff5252" : "#df2a1a",
  };

  const pipelineData = [
    {
      value: insights?.events.completed || 0,
      color: pipelineColors.completed,
      text: "Completed",
    },
    {
      value: insights?.events.ongoing || 0,
      color: pipelineColors.ongoing,
      text: "Ongoing",
    },
    {
      value: insights?.events.upcoming || 0,
      color: pipelineColors.upcoming,
      text: "Upcoming",
    },
  ].filter((t) => t.value > 0);

  const activityPieData =
    stats?.activity_pie_chart?.data.map((item) => ({
      value: item.value,
      color: activityColors[item.text] || mutedFgColor,
      text: item.text,
    })) || [];

  const chartData =
    Array.isArray(trend) && trend.length > 0
      ? trend.map((item) => ({
          value: item.value ?? 0,
          label: item.label ?? "",
        }))
      : [];

  // --- Scroll Handlers to dynamically update indicators ---
  const handleTopScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Card width (140) + gap (16) = 156
    const index = Math.round(offsetX / 156);
    setTopActiveIndex(Math.min(Math.max(index, 0), 2));
  };

  const handleBottomScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Card width (280) + gap (16) = 296
    const index = Math.round(offsetX / 296);
    setBottomActiveIndex(Math.min(Math.max(index, 0), 1));
  };

  return (
    <View className="gap-6 mb-10">
      {/* Top Stats Section */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
          onScroll={handleTopScroll}
          scrollEventThrottle={16}
          snapToInterval={156}
          decelerationRate="fast"
        >
          <View className="w-[140px] bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mb-2">
              <Ionicons name="people" size={18} color={primaryColor} />
            </View>
            <Text className="text-2xl font-black text-foreground dark:text-dark-fg">
              {stats?.total_members || 0}
            </Text>
            <Text className="text-[10px] uppercase font-bold text-muted-fg dark:text-dark-muted-fg tracking-tighter">
              Total Members
            </Text>
          </View>

          <View className="w-[140px] bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mb-2">
              <Ionicons name="notifications" size={18} color={primaryColor} />
            </View>
            <Text className="text-2xl font-black text-primary">
              {stats?.pending_requests || 0}
            </Text>
            <Text className="text-[10px] uppercase font-bold text-muted-fg dark:text-dark-muted-fg tracking-tighter">
              Pending Approval
            </Text>
          </View>

          <View className="w-[140px] bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mb-2">
              <Ionicons name="trending-up" size={18} color={primaryColor} />
            </View>
            <Text className="text-2xl font-black text-primary">
              {stats?.engagement_rate}%
            </Text>
            <Text className="text-[10px] uppercase font-bold text-muted-fg dark:text-dark-muted-fg tracking-tighter">
              Engagement
            </Text>
          </View>
        </ScrollView>

        {/* Dynamic Top Scroll Indicator */}
        <View className="flex-row items-center justify-center mt-3">
          <Ionicons name="chevron-back" size={14} color="#9ca3af" />
          <View className="flex-row gap-1 mx-2">
            {[0, 1].map((i) => (
              <View
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  topActiveIndex === i
                    ? "bg-primary dark:bg-dark-primary"
                    : "bg-primary/40 dark:bg-dark-primary/40"
                }`}
              />
            ))}
          </View>
          <Ionicons name="chevron-forward" size={14} color="#9ca3af" />
        </View>
      </View>

      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border">
          <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4">
            {insights?.pipeline_title || "Event Pipeline"}
          </Text>
          <View className="flex-row items-center justify-between">
            <PieChart
              donut
              innerRadius={35}
              radius={55}
              data={
                pipelineData.length > 0
                  ? pipelineData
                  : [{ value: 1, color: isDark ? "#33394b" : "#e9eaec" }]
              }
              centerLabelComponent={() => (
                <View className="items-center">
                  <Text className="text-xl font-bold text-foreground">
                    {insights?.events.total || 0}
                  </Text>
                </View>
              )}
            />
            <View className="gap-3 mr-4">
              <LegendItem color={pipelineColors.completed} label="Completed" />
              <LegendItem color={pipelineColors.ongoing} label="Ongoing" />
              <LegendItem color={pipelineColors.upcoming} label="Upcoming" />
            </View>
          </View>
        </View>
      </View>

      {/* Demographics & Activity Section */}
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
              Activity Status
            </Text>
            <PieChart
              donut
              innerRadius={20}
              radius={35}
              data={
                activityPieData.length > 0
                  ? activityPieData
                  : [{ value: 1, color: isDark ? "#e9eaec" : "#e9eaec" }]
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
          <View className="w-[280px] bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border">
            <Text className="text-sm font-bold text-foreground dark:text-dark-fg mb-4">
              Demographics
            </Text>
            {insights?.demographics && insights.demographics.length > 0 ? (
              <View className="gap-3">
                {insights.demographics.map((demo, idx) => (
                  <View
                    key={idx}
                    className="flex-row justify-between items-center"
                  >
                    <Text
                      className="text-xs font-semibold text-muted-fg dark:text-dark-muted-fg flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {demo.label}
                    </Text>
                    <View className="bg-primary/10 px-2 py-1 rounded-md">
                      <Text className="text-xs font-black text-primary">
                        {demo.value}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-xs text-muted-fg dark:text-dark-muted-fg text-center mt-4">
                No data available.
              </Text>
            )}
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

      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-6">
            Attendance Trend
          </Text>

          {chartData.length > 0 ? (
            <LineChart
              data={chartData}
              height={120}
              width={screenWidth - 120}
              initialSpacing={10}
              color={primaryColor}
              thickness={3}
              hideYAxisText
              hideRules
              dataPointsColor={primaryColor}
              curved
            />
          ) : (
            <View className="h-[120px] items-center justify-center bg-accent dark:bg-dark-accent rounded-xl border border-dashed border-border dark:border-dark-border">
              <Text className="text-muted-fg dark:text-dark-muted-fg text-xs">
                No attendance data available
              </Text>
            </View>
          )}
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
        className="w-2.5 h-2.5 rounded-full"
      />
      <Text className="text-xs font-medium text-foreground dark:text-dark-fg opacity-80">
        {label}
      </Text>
    </View>
  );
};
