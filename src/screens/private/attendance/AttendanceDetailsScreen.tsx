import { BackButton } from "@/src/components/common/BackButton";
import { useClub } from "@/src/contexts/ClubContext";
import { useRole } from "@/src/hooks/useRole";
import { useTheme } from "@/src/hooks/useTheme";
import { AttendanceStatus } from "@/src/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MemberData {
  user_id: number;
  name: string;
  avatar: string | null;
  course: string;
  status: AttendanceStatus | null;
}

interface Props {
  session: any;
  isLoading: boolean;
  updateStatus: any;
}

export default function AttendanceDetailsScreen({
  session,
  isLoading,
  updateStatus,
}: Props) {
  const router = useRouter();
  const { primaryColor } = useTheme();

  const { activeClubId, isOfficer } = useClub();
  const { isAdmin } = useRole();

  const canManage = isAdmin || (activeClubId && isOfficer(activeClubId));

  const handleStatusChange = (userId: number, status: AttendanceStatus) => {
    if (!canManage) return;
    updateStatus.mutate({ userId, status });
  };

  const membersArray: MemberData[] = session?.members || [];

  const stats = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0, excuse: 0 };
    membersArray.forEach((member) => {
      if (member.status === "present") counts.present++;
      if (member.status === "late") counts.late++;
      if (member.status === "absent") counts.absent++;
      if (member.status === "excuse") counts.excuse++;
    });
    return counts;
  }, [membersArray]);

  const renderAttendanceItem = ({ item }: { item: MemberData }) => {
    const statuses: {
      label: string;
      value: AttendanceStatus;
      color: string;
    }[] = [
      { label: "Present", value: "present", color: "bg-green-500" },
      { label: "Late", value: "late", color: "bg-yellow-500" },
      { label: "Absent", value: "absent", color: "bg-red-500" },
      { label: "Excuse", value: "excuse", color: "bg-blue-500" },
    ];

    return (
      <View className="bg-card dark:bg-dark-card p-4 rounded-2xl mb-3 border border-border dark:border-dark-border">
        <View className="flex-row items-center mb-3">
          <Image
            source={{
              uri:
                item.avatar ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(item.name),
            }}
            className="w-10 h-10 rounded-full mr-3 bg-muted dark:bg-dark-muted"
          />
          <View>
            <Text className="text-base font-bold text-foreground dark:text-dark-fg">
              {item.name}
            </Text>
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
              {item.course || "No Course Info"}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between">
          {statuses.map((st) => {
            const isSelected = item.status === st.value;
            return (
              <TouchableOpacity
                key={st.value}
                disabled={!canManage} // Removed updateStatus.isPending so it feels instant
                onPress={() => handleStatusChange(item.user_id, st.value)}
                className={`flex-1 mx-1 py-2 rounded-lg items-center border ${
                  isSelected
                    ? `${st.color} border-transparent`
                    : "bg-transparent border-border dark:border-dark-border"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected
                      ? "text-white"
                      : "text-muted-fg dark:text-dark-muted-fg"
                  }`}
                >
                  {st.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View className="mb-4">
        {session && (
          <View className="bg-card dark:bg-dark-card p-5 rounded-2xl mb-6 border border-border dark:border-dark-border shadow-sm">
            <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-3">
              {session.title}
            </Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={18} color="#6b7280" />
              <Text className="text-muted-fg dark:text-dark-muted-fg ml-2 text-sm font-medium">
                {new Date(session.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={18} color="#6b7280" />
              <Text className="text-muted-fg dark:text-dark-muted-fg ml-2 text-sm font-medium">
                {session.venue || "No venue specified"}
              </Text>
            </View>
          </View>
        )}

        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] bg-green-500/10 p-3 rounded-xl mb-3 border border-green-500/20">
            <Text className="text-green-600 dark:text-green-400 font-bold text-xs uppercase">
              Present
            </Text>
            <Text className="text-2xl font-black text-foreground dark:text-dark-fg">
              {stats.present}
            </Text>
          </View>
          <View className="w-[48%] bg-yellow-500/10 p-3 rounded-xl mb-3 border border-yellow-500/20">
            <Text className="text-yellow-600 dark:text-yellow-400 font-bold text-xs uppercase">
              Late
            </Text>
            <Text className="text-2xl font-black text-foreground dark:text-dark-fg">
              {stats.late}
            </Text>
          </View>
          <View className="w-[48%] bg-red-500/10 p-3 rounded-xl mb-3 border border-red-500/20">
            <Text className="text-red-600 dark:text-red-400 font-bold text-xs uppercase">
              Absent
            </Text>
            <Text className="text-2xl font-black text-foreground dark:text-dark-fg">
              {stats.absent}
            </Text>
          </View>
          <View className="w-[48%] bg-blue-500/10 p-3 rounded-xl mb-3 border border-blue-500/20">
            <Text className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase">
              Excuse
            </Text>
            <Text className="text-2xl font-black text-foreground dark:text-dark-fg">
              {stats.excuse}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4">
      <View className="flex-row items-center mt-2 mb-6">
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold text-foreground dark:text-dark-fg ml-4">
          Session Details
        </Text>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
      ) : (
        <FlatList
          data={membersArray}
          keyExtractor={(item) => item.user_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No members found for this session.
            </Text>
          }
          renderItem={renderAttendanceItem}
        />
      )}
    </SafeAreaView>
  );
}
