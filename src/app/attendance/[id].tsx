import {
  useSession,
  useUpdateAttendanceStatus,
} from "@/src/hooks/useAttendance";
import AttendanceDetailsScreen from "@/src/screens/private/attendance/AttendanceDetailsScreen";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";

export default function AttendanceDetailsRoute() {
  const params = useGlobalSearchParams();
  const rawId = params.id || params.sessionId;
  const sessionId = rawId ? Number(rawId) : null;

  const { data: session, isLoading } = useSession(sessionId);
  const updateStatus = useUpdateAttendanceStatus(sessionId);

  return (
    <View className="flex-1">
      <AttendanceDetailsScreen
        session={session}
        isLoading={isLoading}
        updateStatus={updateStatus}
      />
    </View>
  );
}
