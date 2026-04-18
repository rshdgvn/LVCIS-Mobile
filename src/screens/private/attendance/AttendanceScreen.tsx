import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";
import { CustomDropdown } from "@/src/components/common/CustomDropdown";
import { CreateSessionModal } from "@/src/components/modals/CreateSessionModal";
import { EditSessionModal } from "@/src/components/modals/EditSessionModal";
import { useClub } from "@/src/contexts/ClubContext";
import { useAttendanceMutations } from "@/src/hooks/useAttendance";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { useRole } from "@/src/hooks/useRole";
import { useTheme } from "@/src/hooks/useTheme";
import { AttendanceSession } from "@/src/types/attendance";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

interface Props {
  sessions: AttendanceSession[];
  analytics: {
    active_members: number;
    inactive_members: number;
    total_members: number;
  } | null;
  isLoading: boolean;
  onAccessSession: (sessionId: number) => void;
}

export default function AttendanceScreen({
  sessions,
  analytics,
  isLoading,
  onAccessSession,
}: Props) {
  const { primaryColor } = useTheme();
  const { clubs, activeClubId, setActiveClubId, isOfficer } = useClub();
  const { canManageClub } = useCanManageClub();
  const queryClient = useQueryClient();
  const { deleteSession } = useAttendanceMutations();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editSession, setEditSession] = useState<AttendanceSession | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [menuSession, setMenuSession] = useState<AttendanceSession | null>(
    null,
  );
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AttendanceSession | null>(
    null,
  );
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const canManage  = (activeClubId && canManageClub(activeClubId));

  const clubOptions = clubs.map((c) => c.name);
  const activeClub = clubs.find((c) => c.id === activeClubId);
  const activeClubName = activeClub?.name || "";

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openMenu = (session: AttendanceSession) => {
    setMenuSession(session);
    setIsMenuVisible(true);
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    setMenuSession(null);
  };

  const handleEditPress = () => {
    setEditSession(menuSession);
    closeMenu();
  };

  const handleDeletePress = () => {
    setDeleteTarget(menuSession);
    closeMenu();
    setIsDeleteDialogVisible(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);

    deleteSession.mutate(deleteTarget.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["attendanceSessions"] });
        Toast.show({ type: "success", text1: "Session deleted successfully!" });
        setIsDeleteDialogVisible(false);
        setDeleteTarget(null);
        setIsDeleting(false);
      },
      onError: (error: any) => {
        const msg =
          error?.response?.data?.message || "Failed to delete session.";
        Toast.show({ type: "error", text1: "Action Failed", text2: msg });
        setIsDeleteDialogVisible(false);
        setIsDeleting(false);
      },
    });
  };

  const renderSessionCard = ({ item }: { item: AttendanceSession }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onAccessSession(item.id)}
      className="bg-card dark:bg-dark-card rounded-2xl mb-4 border border-border dark:border-dark-border flex-row items-center overflow-hidden"
    >
      <View className="px-4 py-5 items-start justify-center min-w-[85px]">
        <Text className="text-sm font-bold text-foreground dark:text-dark-fg">
          {dayjs(item.date).format("h:mm A")}
        </Text>
        <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mt-1">
          {dayjs(item.date).format("MMM, D")}
        </Text>
      </View>

      <View className="w-[3px] self-stretch bg-primary dark:bg-dark-primary rounded-full my-4" />

      <View className="flex-1 px-4 py-5">
        <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-1.5">
          {item.title}
        </Text>
        {item.venue && (
          <View className="flex-row items-center">
            <Ionicons name="location-sharp" size={14} color="#6b7280" />
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg ml-1">
              {item.venue}
            </Text>
          </View>
        )}
      </View>

      {canManage ? (
        <TouchableOpacity
          onPress={() => openMenu(item)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="pr-4 pl-2 py-5"
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      ) : (
        <View className="pr-4">
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="mb-2">
      {/* Club Header */}
      <View className="flex-row items-center mb-6 mt-2 gap-3">
        {activeClub?.logo_url ? (
          <Image
            source={{ uri: activeClub.logo_url }}
            className="w-16 h-16 rounded-full"
          />
        ) : (
          <View className="w-16 h-16 rounded-full bg-primary/10 dark:bg-dark-primary/10 items-center justify-center">
            <Ionicons name="people" size={30} color={primaryColor} />
          </View>
        )}

        <View className="flex-1">
          {activeClubName ? (
            <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-1">
              {activeClubName}
            </Text>
          ) : null}
          {clubs.length > 0 ? (
            <CustomDropdown
              label="Switch Club"
              value={activeClubName}
              options={clubOptions}
              showLabelOnly
              onSelect={(selectedName) => {
                const selectedClub = clubs.find((c) => c.name === selectedName);
                if (selectedClub) setActiveClubId(selectedClub.id);
              }}
            />
          ) : (
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
              No clubs yet
            </Text>
          )}
        </View>
      </View>

      {activeClubId && (
        <>
          {/* Analytics Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ paddingRight: 20, gap: 12 }}
          >
            <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-blue-500/10 items-center justify-center mr-3">
                  <Ionicons name="people" size={24} color="#3b82f6" />
                </View>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
                  Total Members
                </Text>
              </View>
              <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
                {analytics?.total_members || 0}
              </Text>
            </View>

            <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-green-500/10 items-center justify-center mr-3">
                  <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                </View>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
                  Active Members
                </Text>
              </View>
              <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
                {analytics?.active_members || 0}
              </Text>
            </View>

            <View className="bg-card dark:bg-dark-card p-5 rounded-2xl border border-border dark:border-dark-border items-start w-[180px]">
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </View>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg font-medium flex-1">
                  Inactive Members
                </Text>
              </View>
              <Text className="text-4xl font-bold text-foreground dark:text-dark-fg">
                {analytics?.inactive_members || 0}
              </Text>
            </View>
          </ScrollView>

          {/* Search + Filter */}
          <View className="flex-row items-center mb-6 gap-2">
            <View className="flex-1 flex-row items-center bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 h-12">
              <Ionicons name="search-outline" size={20} color="#9ca3af" />
              <TextInput
                placeholder="Search events"
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

          <Text className="text-lg font-bold text-foreground dark:text-dark-fg mb-4">
            Recent events
          </Text>
        </>
      )}

      {!activeClubId && clubs.length === 0 && (
        <Text className="text-muted-fg dark:text-dark-muted-fg text-base mt-2">
          You are not part of any clubs yet.
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg px-4">
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          className="mt-10"
        />
      ) : (
        <FlatList
          data={filteredSessions}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            activeClubId ? (
              <Text className="text-center text-muted-fg dark:text-dark-muted-fg mt-10">
                No attendance sessions found for this club.
              </Text>
            ) : null
          }
          renderItem={renderSessionCard}
        />
      )}

      {/* FAB */}
      {canManage && (
        <TouchableOpacity
          onPress={() => setIsCreateModalVisible(true)}
          className="absolute bottom-6 right-5 w-14 h-14 bg-primary dark:bg-dark-primary rounded-full items-center justify-center shadow-lg shadow-primary/30 elevation-5"
        >
          <Ionicons name="add" size={30} color="#ffffff" />
        </TouchableOpacity>
      )}

      {/* Create Modal */}
      {activeClubId && (
        <CreateSessionModal
          isVisible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          clubId={activeClubId}
        />
      )}

      {/* Edit Modal */}
      <EditSessionModal
        isVisible={!!editSession}
        onClose={() => setEditSession(null)}
        session={editSession}
      />

      {/* Three-dots bottom sheet */}
      <Modal
        visible={isMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={closeMenu}
        >
          <Pressable>
            <View className="bg-background dark:bg-dark-bg rounded-t-3xl pt-3 pb-10 px-6">
              <View className="w-12 h-1.5 bg-border dark:bg-dark-border rounded-full self-center mb-6" />

              <Text className="text-base font-bold text-foreground dark:text-dark-fg mb-4">
                {menuSession?.title}
              </Text>

              <TouchableOpacity
                onPress={handleEditPress}
                className="flex-row items-center py-4 border-b border-border dark:border-dark-border"
              >
                <View className="w-9 h-9 rounded-full bg-blue-500/10 items-center justify-center mr-3">
                  <Ionicons name="pencil" size={18} color="#3b82f6" />
                </View>
                <Text className="text-base font-medium text-foreground dark:text-dark-fg">
                  Edit Session
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDeletePress}
                className="flex-row items-center py-4"
              >
                <View className="w-9 h-9 rounded-full bg-red-500/10 items-center justify-center mr-3">
                  <Ionicons name="trash" size={18} color="#ef4444" />
                </View>
                <Text className="text-base font-medium text-red-500">
                  Delete Session
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <CustomAlertDialog
        visible={isDeleteDialogVisible}
        title="Delete Session"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        cancelText="Cancel"
        confirmText="Delete"
        onCancel={() => !isDeleting && setIsDeleteDialogVisible(false)}
        onConfirm={handleConfirmDelete}
        isDestructive={true}
        isLoading={isDeleting}
      />
    </SafeAreaView>
  );
}
