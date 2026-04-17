import { BackButton } from "@/src/components/common/BackButton";
import { useClub } from "@/src/contexts/ClubContext";
import { useRole } from "@/src/hooks/useRole";
import { useTheme } from "@/src/hooks/useTheme";
import { attendanceService } from "@/src/services/attendanceService";
import { AttendanceStatus } from "@/src/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

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

const STATUS_OPTIONS: {
  label: string;
  value: AttendanceStatus;
  selectedBg: string;
  selectedText: string;
}[] = [
  {
    label: "Present",
    value: "present",
    selectedBg: "bg-green-500",
    selectedText: "text-white",
  },
  {
    label: "Late",
    value: "late",
    selectedBg: "bg-yellow-400",
    selectedText: "text-white",
  },
  {
    label: "Absent",
    value: "absent",
    selectedBg: "bg-red-500",
    selectedText: "text-white",
  },
  {
    label: "Excused",
    value: "excuse",
    selectedBg: "bg-blue-500",
    selectedText: "text-white",
  },
];

export default function AttendanceDetailsScreen({
  session,
  isLoading,
  updateStatus,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { primaryColor } = useTheme();
  const { activeClubId, isOfficer } = useClub();
  const { isAdmin } = useRole();

  const canManage = isAdmin || (activeClubId && isOfficer(activeClubId));

  const membersArray: MemberData[] = session?.members || [];

  // Local pending changes: userId -> status
  const [pendingChanges, setPendingChanges] = useState<
    Record<number, AttendanceStatus>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasChanges = Object.keys(pendingChanges).length > 0;

  // Effective status = pending override or server value
  const getStatus = (member: MemberData): AttendanceStatus | null =>
    pendingChanges[member.user_id] !== undefined
      ? pendingChanges[member.user_id]
      : member.status;

  const handleStatusChange = (userId: number, status: AttendanceStatus) => {
    if (!canManage) return;
    // Find original status
    const original = membersArray.find((m) => m.user_id === userId)?.status;
    setPendingChanges((prev) => {
      const next = { ...prev };
      // If reverting to original, remove from pending
      if (status === original) {
        delete next[userId];
      } else {
        next[userId] = status;
      }
      return next;
    });
  };

  const handleMarkAllPresent = () => {
    if (!canManage) return;
    const next: Record<number, AttendanceStatus> = {};
    membersArray.forEach((m) => {
      if (m.status !== "present") next[m.user_id] = "present";
    });
    setPendingChanges(next);
  };

  // Track session id in a ref so we can invalidate on back without causing re-render
  const sessionIdRef = useRef<number | null>(session?.id ?? null);
  if (session?.id) sessionIdRef.current = session.id;

  const handleSubmit = async () => {
    if (!hasChanges || isSubmitting || !session?.id) return;
    setIsSubmitting(true);

    // Snapshot the changes we're about to submit
    const changesToSubmit = { ...pendingChanges };

    try {
      await Promise.all(
        Object.entries(changesToSubmit).map(([userId, status]) =>
          attendanceService.updateUserStatus(
            session.id,
            Number(userId),
            status,
          ),
        ),
      );

      // Immediately patch the query cache so the UI never flickers back
      // to old values when the query eventually refetches
      queryClient.setQueryData(["session", session.id], (oldData: any) => {
        if (!oldData?.members) return oldData;
        return {
          ...oldData,
          members: oldData.members.map((member: any) => {
            const newStatus = changesToSubmit[member.user_id];
            return newStatus !== undefined
              ? { ...member, status: newStatus }
              : member;
          }),
        };
      });

      setPendingChanges({});

      Toast.show({
        type: "success",
        text1: "Attendance submitted successfully!",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Failed to submit attendance. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    // Invalidate AFTER navigating back so the list screen gets fresh data
    // without causing this screen to re-render/reset
    router.back();
    if (sessionIdRef.current) {
      queryClient.invalidateQueries({
        queryKey: ["session", sessionIdRef.current],
      });
      queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
    }
  };

  const stats = useMemo(() => {
    const counts = { present: 0, late: 0, absent: 0, excuse: 0 };
    membersArray.forEach((member) => {
      const s = getStatus(member);
      if (s === "present") counts.present++;
      if (s === "late") counts.late++;
      if (s === "absent") counts.absent++;
      if (s === "excuse") counts.excuse++;
    });
    return counts;
  }, [membersArray, pendingChanges]);

  const filteredMembers = membersArray.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderAttendanceItem = ({ item }: { item: MemberData }) => {
    const currentStatus = getStatus(item);

    return (
      <View className="bg-card dark:bg-dark-card p-4 rounded-2xl mb-3 border border-border dark:border-dark-border">
        {/* Avatar + Name */}
        <View className="flex-row items-center mb-3">
          <Image
            source={{
              uri:
                item.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=random`,
            }}
            className="w-12 h-12 rounded-full mr-3 bg-muted dark:bg-dark-muted"
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

        {/* Status Pills */}
        <View className="flex-row justify-between gap-2">
          {STATUS_OPTIONS.map((st) => {
            const isSelected = currentStatus === st.value;
            return (
              <TouchableOpacity
                key={st.value}
                disabled={!canManage}
                onPress={() => handleStatusChange(item.user_id, st.value)}
                className={`flex-1 py-2 rounded-lg items-center border ${
                  isSelected
                    ? `${st.selectedBg} border-transparent`
                    : "bg-transparent border-border dark:border-dark-border"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isSelected
                      ? st.selectedText
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

  const renderHeader = () => (
    <View className="mb-2">
      {/* Analytics Cards - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-5"
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

      {/* Search + Filter */}
      <View className="flex-row items-center mb-5 gap-2">
        <View className="flex-1 flex-row items-center bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 h-12">
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            placeholder="Search members"
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-base text-foreground dark:text-dark-fg"
          />
        </View>
        <TouchableOpacity className="w-12 h-12 bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl items-center justify-center">
          <Ionicons name="filter-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Members count + Mark All Present */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-base font-bold text-foreground dark:text-dark-fg">
          Members ({membersArray.length})
        </Text>
        {canManage && (
          <TouchableOpacity onPress={handleMarkAllPresent}>
            <Text className="text-sm font-semibold text-primary dark:text-dark-primary">
              Mark All Present
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4">
      {/* Header: back + title + date */}
      <View className="flex-row items-center mt-2 mb-6">
        <BackButton onPress={handleBack} />
        <View className="flex-1 items-center mr-8">
          <Text className="text-lg font-bold text-foreground dark:text-dark-fg">
            {session?.title || "Session Details"}
          </Text>
          {session?.date && (
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mt-0.5">
              {new Date(session.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          )}
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
          data={filteredMembers}
          keyExtractor={(item) => item.user_id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: hasChanges ? 100 : 40 }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No members found for this session.
            </Text>
          }
          renderItem={renderAttendanceItem}
        />
      )}

      {/* Submit Attendance button — only visible when there are pending changes */}
      {hasChanges && canManage && (
        <View className="absolute bottom-6 left-4 right-4">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary dark:bg-dark-primary rounded-2xl py-4 items-center shadow-lg"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">
                Submit Attendance
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
