import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path, Circle as SvgCircle } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48;

// Static chart data — 6 months
const CHART_DATA = [
  { label: "MAR", value: 55 },
  { label: "APR", value: 62 },
  { label: "MAY", value: 75 },
  { label: "JUN", value: 68 },
  { label: "JUL", value: 72 },
  { label: "AUG", value: 88 },
];

// Circular progress ring
const CircularProgress = ({
  percent,
  size = 90,
  strokeWidth = 10,
  color = "#3b82f6",
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) => {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
        />
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#111827" }}>
          {percent}%
        </Text>
      </View>
    </View>
  );
};

// Mini line chart
const LineChart = () => {
  const chartW = CARD_WIDTH - 48;
  const chartH = 100;
  const padLeft = 8;
  const padRight = 8;
  const padTop = 12;
  const padBottom = 8;

  const minVal = Math.min(...CHART_DATA.map((d) => d.value));
  const maxVal = Math.max(...CHART_DATA.map((d) => d.value));
  const range = maxVal - minVal || 1;

  const points = CHART_DATA.map((d, i) => {
    const x =
      padLeft + (i / (CHART_DATA.length - 1)) * (chartW - padLeft - padRight);
    const y =
      padTop + (1 - (d.value - minVal) / range) * (chartH - padTop - padBottom);
    return { x, y };
  });

  // Build polyline path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <View>
      <Svg width={chartW} height={chartH}>
        {/* Line */}
        <Path
          d={linePath}
          stroke="#3b82f6"
          strokeWidth={2.5}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots */}
        {points.map((p, i) => (
          <SvgCircle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
        ))}
      </Svg>

      {/* X labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 6,
          paddingHorizontal: padLeft,
        }}
      >
        {CHART_DATA.map((d) => (
          <Text
            key={d.label}
            style={{ fontSize: 11, color: "#9ca3af", fontWeight: "500" }}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

interface Props {
  onProfile: () => void;
}

export const DashboardScreen = ({ onProfile }: Props) => {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <TouchableOpacity
            onPress={onProfile}
            activeOpacity={0.7}
            className="flex-row items-center flex-1"
          >
            <Image
              source={{ uri: user?.avatar }}
              className="w-14 h-14 rounded-full mr-3 bg-muted dark:bg-dark-muted"
            />
            <View>
              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium">
                Welcome,
              </Text>
              <Text
                className="text-lg text-foreground dark:text-dark-fg font-bold"
                numberOfLines={1}
              >
                {user?.first_name} {user?.last_name}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Notification bell */}
          <TouchableOpacity className="w-11 h-11 rounded-full bg-card dark:bg-dark-card border border-border dark:border-dark-border items-center justify-center">
            <View>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#6b7280"
              />
              {/* Red dot */}
              <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500" />
            </View>
          </TouchableOpacity>
        </View>

        <View className="px-6 mt-4 gap-4">
          {/* Total Active Clubs Card */}
          <View className="bg-card dark:bg-dark-card rounded-2xl p-5 border border-border dark:border-dark-border">
            <View className="flex-row items-center mb-3">
              <Ionicons name="people" size={18} color="#3b82f6" />
              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg ml-2 font-medium">
                Total Active Clubs
              </Text>
            </View>
            <Text className="text-5xl font-bold text-foreground dark:text-dark-fg mb-3">
              2
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="trending-up" size={16} color="#22c55e" />
              <Text className="text-sm text-green-500 font-semibold ml-1">
                +1 This Semester
              </Text>
            </View>
          </View>

          {/* Overall Engagement Card */}
          <View className="bg-card dark:bg-dark-card rounded-2xl p-5 border border-border dark:border-dark-border">
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium mb-4">
              Overall Engagement
            </Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-5xl font-bold text-foreground dark:text-dark-fg mb-3">
                  78%
                </Text>
                <View className="flex-row items-center flex-wrap gap-x-2">
                  <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
                    Target: 85%
                  </Text>
                  <Text className="text-muted-fg dark:text-dark-muted-fg">
                    •
                  </Text>
                  <Text className="text-sm text-green-500 font-semibold">
                    +2.4% vs Last Month
                  </Text>
                </View>
              </View>
              <CircularProgress
                percent={78}
                size={90}
                strokeWidth={10}
                color="#3b82f6"
              />
            </View>
          </View>

          {/* Monthly Attendance Trend Card */}
          <View className="bg-card dark:bg-dark-card rounded-2xl p-5 border border-border dark:border-dark-border">
            <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-1">
              Monthly Attendance Trend
            </Text>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mb-5">
              Last 6 months · Verified Data
            </Text>
            <LineChart />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
