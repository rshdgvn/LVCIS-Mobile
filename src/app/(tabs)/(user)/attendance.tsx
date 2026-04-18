import { useClub } from "@/src/contexts/ClubContext";
import { useSessions } from "@/src/hooks/useAttendance";
import AttendanceScreen from "@/src/screens/private/attendance/AttendanceScreen";
import { Href, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function AttendanceRoute() {
  const router = useRouter();
  const { activeClubId } = useClub();

  const { data, isLoading } = useSessions(activeClubId);

  const sessions = data?.sessions || [];
  const analytics = data?.analytics || null;

  const handleAccessSession = (sessionId: number) => {
    router.push(`/attendance/${sessionId}` as Href);
  };

  // Navigate to Home tab where the club switcher lives
  const handleSwitchClub = () => {
    router.push("/(tabs)" as Href);
  };

  return (
    <View className="flex-1">
      <AttendanceScreen
        sessions={sessions}
        analytics={analytics}
        isLoading={isLoading}
        onAccessSession={handleAccessSession}
        onSwitchClub={handleSwitchClub}
      />
    </View>
  );
}
