import { BackButton } from "@/src/components/common/BackButton";
import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Props {
  data: any;
  isLoading: boolean;
  onBack: () => void;
  onSessionPress?: (sessionId: number) => void;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case "present":
      return {
        bg: "bg-green-500/10",
        text: "text-green-500",
        label: "Present",
      };
    case "late":
      return {
        bg: "bg-yellow-400/10",
        text: "text-yellow-600 dark:text-yellow-400",
        label: "Late",
      };
    case "absent":
      return { bg: "bg-red-500/10", text: "text-red-500", label: "Absent" };
    case "excuse":
      return { bg: "bg-blue-500/10", text: "text-blue-500", label: "Excused" };
    default:
      return { bg: "bg-muted", text: "text-muted-fg", label: status };
  }
};

export default function MemberAttendanceScreen({
  data,
  isLoading,
  onBack,
  onSessionPress,
}: Props) {
  const { primaryColor } = useTheme();
  const insets = useSafeAreaInsets();

  const user = data?.user;
  const stats = data?.stats || { present: 0, late: 0, absent: 0, excuse: 0 };
  const attendances = data?.attendances || [];

  const renderAttendanceItem = ({ item }: { item: any }) => {
    const config = getStatusConfig(item.status);
    const sessionDate = item.session?.date ? new Date(item.session.date) : null;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => item.session?.id && onSessionPress?.(item.session.id)}
        className="bg-card dark:bg-dark-card p-4 rounded-2xl mb-3 border border-border dark:border-dark-border flex-row items-center justify-between"
      >
        <View className="flex-1 mr-4">
          <Text
            className="text-base font-bold text-foreground dark:text-dark-fg mb-1"
            numberOfLines={1}
          >
            {item.session?.title || "Unknown Session"}
          </Text>
          <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
            {sessionDate
              ? sessionDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No date provided"}
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <View className={`px-4 py-1.5 rounded-full ${config.bg}`}>
            <Text className={`text-xs font-bold ${config.text}`}>
              {config.label}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View className="mb-2">
      <View className="items-center mb-8 mt-2">
        <Image
          source={{
            uri:
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User",
              )}&background=random`,
          }}
          className="w-24 h-24 rounded-full bg-muted dark:bg-dark-muted mb-4 border-4 border-background dark:border-dark-bg shadow-sm"
        />
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mb-1">
          {user?.name || "Member Details"}
        </Text>
        <Text className="text-sm font-semibold text-primary dark:text-dark-primary uppercase tracking-widest">
          {user?.role || "Member"}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
        contentContainerStyle={{ paddingRight: 20, gap: 12 }}
      >
        <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center mr-3">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
              Total Present
            </Text>
          </View>
          <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
            {stats.present}
          </Text>
        </View>

        <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-yellow-400/10 items-center justify-center mr-3">
              <Ionicons name="time" size={24} color="#facc15" />
            </View>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
              Total Late
            </Text>
          </View>
          <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
            {stats.late}
          </Text>
        </View>

        <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </View>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
              Total Absent
            </Text>
          </View>
          <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
            {stats.absent}
          </Text>
        </View>

        <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center mr-3">
              <Ionicons name="shield-checkmark" size={24} color="#3b82f6" />
            </View>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
              Total Excused
            </Text>
          </View>
          <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
            {stats.excuse}
          </Text>
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-foreground dark:text-dark-fg">
          Session History ({attendances.length})
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4">
      <View className="flex-row items-center mt-2 mb-2">
        <BackButton onPress={onBack} />
        <View className="flex-1 items-center mr-8">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg">
            Attendance Record
          </Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
      ) : (
        <FlatList
          data={attendances}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: Math.max(insets.bottom + 40, 40),
          }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No attendance history found for this member.
            </Text>
          }
          renderItem={renderAttendanceItem}
        />
      )}
    </SafeAreaView>
  );
}
