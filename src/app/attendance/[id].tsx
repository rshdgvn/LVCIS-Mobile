import {
  useSession,
  useUpdateAttendanceStatus,
} from "@/src/hooks/useAttendance";
import AttendanceDetailsScreen from "@/src/screens/private/attendance/AttendanceDetailsScreen";
import { Href, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AttendanceDetailsRoute() {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const rawId = params.id || params.sessionId;
  const sessionId = rawId ? Number(rawId) : null;

  const { data: session, isLoading } = useSession(sessionId);
  const updateStatus = useUpdateAttendanceStatus(sessionId);

  const handleMemberPress = (userId: number) => {
    router.replace(`/attendance/member/${userId}` as Href);
  };

  return (
    <View className="flex-1">
      <AttendanceDetailsScreen
        session={session}
        isLoading={isLoading}
        updateStatus={updateStatus}
        onMemberPress={handleMemberPress}
      />
    </View>
  );
}
