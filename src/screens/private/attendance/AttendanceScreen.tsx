// src/screens/private/attendance/AttendanceScreen.tsx

import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { CreateSessionModal } from "@/src/components/modals/CreateSessionModal";
import { useClub } from "@/src/contexts/ClubContext";
import { useRole } from "@/src/hooks/useRole";
import { useTheme } from "@/src/hooks/useTheme";
import { AttendanceSession } from "@/src/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  sessions: AttendanceSession[] | undefined;
  isLoading: boolean;
  onAccessSession: (sessionId: number) => void;
}

export default function AttendanceScreen({
  sessions,
  isLoading,
  onAccessSession,
}: Props) {
  const { primaryColor } = useTheme();
  const { clubs, activeClubId, setActiveClubId, isOfficer } = useClub();
  const { isAdmin } = useRole();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const clubOptions = clubs.map((c) => c.name);
  const activeClubName = clubs.find((c) => c.id === activeClubId)?.name || "";

  const canManage = isAdmin || (activeClubId && isOfficer(activeClubId));

  const renderSessionCard = ({ item }: { item: AttendanceSession }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onAccessSession(item.id)}
      className="bg-card dark:bg-dark-card p-4 rounded-2xl mb-4 border border-border dark:border-dark-border"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-foreground dark:text-dark-fg flex-1">
          {item.title}
        </Text>
        <View
          className={`px-2 py-1 rounded-md ${item.is_open ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}
        >
          <Text
            className={`text-xs font-bold ${item.is_open ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {item.is_open ? "OPEN" : "CLOSED"}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center mt-1">
        <Ionicons name="calendar-outline" size={16} color="#6b7280" />
        <Text className="text-muted-fg dark:text-dark-muted-fg ml-2 text-sm">
          {dayjs(item.date).format("MMMM D, YYYY")}
        </Text>
      </View>
      {item.venue && (
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={16} color="#6b7280" />
          <Text className="text-muted-fg dark:text-dark-muted-fg ml-2 text-sm">
            {item.venue}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4">
      <View className="mb-6 mt-2">
        <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mb-4">
          Attendance
        </Text>

        {clubs.length > 0 ? (
          <CustomDropdown
            label="Selected Club"
            value={activeClubName}
            options={clubOptions}
            onSelect={(selectedName) => {
              const selectedClub = clubs.find((c) => c.name === selectedName);
              if (selectedClub) setActiveClubId(selectedClub.id);
            }}
          />
        ) : (
          <Text className="text-muted-fg dark:text-dark-muted-fg">
            You are not part of any clubs yet.
          </Text>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
      ) : (
        <FlatList
          data={sessions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListEmptyComponent={
            <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
              No attendance sessions found for this club.
            </Text>
          }
          renderItem={renderSessionCard}
        />
      )}

      {canManage && (
        <TouchableOpacity
          onPress={() => setIsCreateModalVisible(true)}
          className="absolute bottom-6 right-5 w-14 h-14 bg-primary dark:bg-dark-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 elevation-5"
        >
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>
      )}

      {activeClubId && (
        <CreateSessionModal
          isVisible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          clubId={activeClubId}
        />
      )}
    </SafeAreaView>
  );
}
