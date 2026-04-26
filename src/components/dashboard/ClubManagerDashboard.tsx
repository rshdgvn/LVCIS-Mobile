import { useManagerDashboard } from "@/src/hooks/useDashboard";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Dimensions, Text, View } from "react-native";
import { LineChart, PieChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;

export const ClubManagerDashboard = ({ clubId }: { clubId: number }) => {
  const { stats, insights, trend, isLoading } = useManagerDashboard(clubId);
  const { primaryColor, mutedFgColor, isDark } = useTheme();

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

  return (
    <View className="gap-6 mb-10">
      <View className="px-6 flex-row gap-4">
        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border shadow-sm">
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

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border shadow-sm">
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

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-4 border border-border dark:border-dark-border shadow-sm">
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
      </View>

      <View className="px-6">
        <View className="bg-card dark:bg-dark-card rounded-3xl p-6 border border-border dark:border-dark-border shadow-sm">
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
                  <Text className="text-xl font-bold text-foreground dark:text-dark-fg">
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

      <View className="px-6 flex-row gap-4">
        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
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

        <View className="flex-1 bg-card dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center">
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
