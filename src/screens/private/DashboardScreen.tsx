import { useAuth } from "@/src/contexts/AuthContext";
import { useClub } from "@/src/contexts/ClubContext";
import { useIsAdmin } from "@/src/hooks/useIsAdmin"; // Adjust path if needed
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
  size = 70, // Slightly smaller for the new grid layout
  strokeWidth = 8,
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
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={size} height={size} style={{ position: "absolute" }}>
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
      <Text style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}>
        {percent}%
      </Text>
    </View>
  );
};

// Mini line chart
const LineChart = () => {
  const chartW = CARD_WIDTH - 40;
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
          strokeWidth={3}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots */}
        {points.map((p, i) => (
          <SvgCircle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4.5}
            fill="#3b82f6"
            stroke="#ffffff"
            strokeWidth={2}
          />
        ))}
      </Svg>

      {/* X labels */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 8,
          paddingHorizontal: padLeft,
        }}
      >
        {CHART_DATA.map((d) => (
          <Text
            key={d.label}
            style={{ fontSize: 11, color: "#9ca3af", fontWeight: "600" }}
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
  const isAdmin = useIsAdmin();
  const insets = useSafeAreaInsets();

  const { clubs, activeClubId, setActiveClubId, getUserRole } = useClub();
  const [clubModalVisible, setClubModalVisible] = useState(false);

  const activeClub = clubs.find((c) => c.id === activeClubId);
  const isGeneralView = activeClubId === null;

  // Determine exactly what role to display
  let displayRole = "Member";
  if (isAdmin) {
    displayRole = "Admin";
  } else if (activeClubId) {
    const rawRole = getUserRole(activeClubId);
    if (rawRole) {
      // Capitalize the first letter (e.g., "officer" -> "Officer")
      displayRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
    }
  } else {
    displayRole = "System Overview";
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-dark-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* 1. Standard App Header (Text left, Avatar right) */}
        <View className="flex-row items-center px-6 pt-6 pb-6">
          <TouchableOpacity
            onPress={onProfile}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-primary/10 mr-4 dark:bg-dark-primary/10 items-center justify-center border border-border dark:border-dark-border overflow-hidden shadow-sm"
          >
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <Ionicons name="person" size={20} color="#3b82f6" />
            )}
          </TouchableOpacity>
          <View>
            <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg tracking-wider">
              Welcome back
            </Text>
            <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </View>

        {/* 2. Prominent Context/Club Switcher Card */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setClubModalVisible(true)}
            className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border flex-row items-center shadow-sm"
          >
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mr-4 overflow-hidden">
              {isGeneralView ? (
                <Ionicons name="grid" size={26} color="#3b82f6" />
              ) : activeClub?.logo_url ? (
                <Image
                  source={{ uri: activeClub.logo_url }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <Ionicons name="people" size={26} color="#3b82f6" />
              )}
            </View>

            <View className="flex-1 justify-center">
              <View className="flex-row items-center mb-1">
                <Text className="text-xs font-bold text-primary dark:text-dark-primary tracking-wide">
                  {displayRole}
                </Text>
              </View>
              <Text
                className="text-lg font-bold text-foreground dark:text-dark-fg"
                numberOfLines={1}
              >
                {isGeneralView
                  ? "General Overview"
                  : activeClub
                    ? activeClub.name
                    : "Select a Club"}
              </Text>
            </View>

            <View className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700">
              <Ionicons name="swap-vertical" size={20} color="#64748b" />
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. Dashboard Metrics (2-Column Grid) */}
        <View className="px-6 flex-row gap-4 mb-4">
          {/* Left Column: Active Clubs */}
          <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm justify-between">
            <View className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 items-center justify-center mb-4">
              <Ionicons name="people" size={20} color="#22c55e" />
            </View>
            <View>
              <Text className="text-3xl font-bold text-foreground dark:text-dark-fg mb-1">
                {clubs.length}
              </Text>
              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium leading-tight">
                Total Active{"\n"}Clubs
              </Text>
            </View>
          </View>

          {/* Right Column: Engagement */}
          <View className="flex-1 bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm items-center justify-center">
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg font-medium mb-3 self-start">
              Engagement
            </Text>
            <CircularProgress
              percent={78}
              size={76}
              strokeWidth={8}
              color="#3b82f6"
            />
          </View>
        </View>

        {/* 4. Full Width Chart Card */}
        <View className="px-6 gap-4">
          <View className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border shadow-sm">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-1">
                  Attendance Trend
                </Text>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium">
                  Last 6 months
                </Text>
              </View>
              <Ionicons name="trending-up" size={20} color="#9ca3af" />
            </View>
            <LineChart />
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={clubModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClubModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {/* Top area dismisses modal when tapped */}
          <Pressable
            className="flex-1"
            onPress={() => setClubModalVisible(false)}
          />

          <View
            className="bg-white dark:bg-dark-bg rounded-t-[32px] pt-4 shadow-xl"
            style={{
              maxHeight: "85%",
              paddingBottom: Math.max(insets.bottom, 24),
            }}
          >
            <View className="px-6">
              <View className="w-14 h-1.5 bg-slate-200 dark:bg-dark-border rounded-full self-center mb-6" />

              <View className="mb-6">
                <Text className="text-2xl font-bold text-slate-800 dark:text-dark-fg mb-1">
                  Switch Context
                </Text>
                <Text className="text-sm text-slate-500 dark:text-dark-muted-fg">
                  Select which club workspace to view
                </Text>
              </View>
            </View>

            <FlatList
              data={clubs}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              className="px-6"
              contentContainerStyle={{ paddingBottom: 16 }}
              ListHeaderComponent={
                isAdmin ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveClubId(null);
                      setClubModalVisible(false);
                    }}
                    className={`flex-row items-center p-4 mb-3 rounded-2xl border ${
                      isGeneralView
                        ? "bg-blue-50 dark:bg-dark-primary/10 border-blue-200 dark:border-dark-primary/30"
                        : "bg-slate-50 dark:bg-dark-card border-slate-100 dark:border-dark-border"
                    }`}
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${isGeneralView ? "bg-blue-100" : "bg-white border border-slate-200"}`}
                    >
                      <Ionicons
                        name="grid"
                        size={22}
                        color={isGeneralView ? "#2563EB" : "#64748b"}
                      />
                    </View>

                    <View className="flex-1">
                      <Text
                        className={`text-base ${isGeneralView ? "font-bold text-blue-700" : "font-semibold text-slate-700"}`}
                      >
                        General Overview
                      </Text>
                      <Text className="text-xs text-slate-500 font-medium mt-0.5">
                        Admin Level View
                      </Text>
                    </View>

                    {isGeneralView && (
                      <Ionicons
                        name="checkmark-circle"
                        size={26}
                        color="#3b82f6"
                      />
                    )}
                  </TouchableOpacity>
                ) : null
              }
              ListEmptyComponent={
                <View className="py-12 items-center">
                  <View className="w-20 h-20 rounded-full bg-slate-50 items-center justify-center mb-4 border border-slate-100">
                    <Ionicons name="people-outline" size={36} color="#94a3b8" />
                  </View>
                  <Text className="text-slate-500 dark:text-dark-muted-fg text-base text-center font-medium">
                    You are not assigned to any clubs.
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = item.id === activeClubId;
                const itemRole = getUserRole(item.id);
                const displayItemRole = itemRole
                  ? itemRole.charAt(0).toUpperCase() + itemRole.slice(1)
                  : "Member";

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveClubId(item.id);
                      setClubModalVisible(false);
                    }}
                    className={`flex-row items-center p-4 mb-3 rounded-2xl border ${
                      isSelected
                        ? "bg-blue-50 dark:bg-dark-primary/10 border-blue-200 dark:border-dark-primary/30"
                        : "bg-slate-50 dark:bg-dark-card border-slate-100 dark:border-dark-border"
                    }`}
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center mr-4 overflow-hidden ${!item.logo_url && "bg-white border border-slate-200"}`}
                    >
                      {item.logo_url ? (
                        <Image
                          source={{ uri: item.logo_url }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <Ionicons name="people" size={22} color="#64748b" />
                      )}
                    </View>

                    <View className="flex-1 pr-2">
                      <Text
                        className={`text-base mb-0.5 ${
                          isSelected
                            ? "font-bold text-blue-700 dark:text-primary"
                            : "font-semibold text-slate-700 dark:text-dark-fg"
                        }`}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-dark-muted-fg font-medium">
                        {displayItemRole}
                      </Text>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={26}
                        color="#3b82f6"
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
