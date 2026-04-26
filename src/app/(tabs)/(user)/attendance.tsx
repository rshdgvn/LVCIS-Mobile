import { useAuth } from "@/src/contexts/AuthContext";
import { useClub } from "@/src/contexts/ClubContext";
import { useSessions } from "@/src/hooks/useAttendance";
import AttendanceScreen from "@/src/screens/private/attendance/AttendanceScreen";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AttendanceRoute() {
  const router = useRouter();
  const { activeClubId } = useClub();
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const { data, isLoading } = useSessions(activeClubId, isAdmin);

  const sessions = data?.sessions || [];
  const analytics = data?.analytics || null;

  const handleAccessSession = (sessionId: number) => {
    console.log("Accessing session with ID:", sessionId);
    router.push(`/attendance/${sessionId}` as Href);
  };

  return (
    <View className="flex-1">
      <AttendanceScreen
        sessions={sessions}
        analytics={analytics}
        isLoading={isLoading}
        onAccessSession={handleAccessSession}
        isAdmin={isAdmin}
      />
    </View>
  );
}
