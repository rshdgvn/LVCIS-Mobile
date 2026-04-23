import { useClub } from "@/src/contexts/ClubContext";
import { useMemberAttendance } from "@/src/hooks/useAttendance";
import MemberAttendanceScreen from "@/src/screens/private/attendance/MemberAttendanceScreen";
import { Href, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export default function MemberAttendanceRoute() {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const { activeClubId } = useClub();

  const userId = params.id ? Number(params.id) : null;

  const { data, isLoading } = useMemberAttendance(userId, activeClubId);

  const handleSessionPress = (sessionId: number) => {
    router.replace(`/attendance/${sessionId}` as Href);
  };

  return (
    <View className="flex-1">
      <MemberAttendanceScreen
        data={data}
        isLoading={isLoading}
        onBack={() => router.navigate("/attendance" as Href)}
        onSessionPress={handleSessionPress}
      />
    </View>
  );
}
