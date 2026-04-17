import { useClub } from "@/src/contexts/ClubContext";
import { useSessions } from "@/src/hooks/useAttendance";
import AttendanceScreen from "@/src/screens/private/attendance/AttendanceScreen";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AttendanceRoute() {
  const router = useRouter();
  const { activeClubId } = useClub();

  const { data: sessions = [], isLoading } = useSessions(activeClubId);

  const handleAccessSession = (sessionId: number) => {
    console.log("Accessing session with ID:", sessionId);
    router.push(`/attendance/${sessionId}` as Href);
  };

  return (
    <View className="flex-1">
      <AttendanceScreen
        sessions={sessions}
        isLoading={isLoading}
        onAccessSession={handleAccessSession}
      />
    </View>
  );
}
