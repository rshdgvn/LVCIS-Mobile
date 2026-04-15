import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { EditRoleModal } from "../modals/EditRoleModal";
import { MemberListItem } from "./MemberListItem";

interface Props {
  clubId: number;
}

export const ClubOfficersTab = ({ clubId }: Props) => {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  const { canManageClub } = useCanManageClub();
  const canManage = canManageClub(clubId);

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isRemoveDialogVisible, setIsRemoveDialogVisible] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<any>(null);

  const { data: rawData, isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: () => membershipService.getClubMembers(clubId),
  });

  const updateRoleMutation = useMutation({
    mutationFn: (data: {
      userId: number;
      role: "member" | "officer";
      officerTitle?: string;
    }) =>
      membershipService.updateMemberRole(clubId, data.userId, {
        role: data.role,
        officerTitle: data.officerTitle,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
      setIsEditModalVisible(false);
      setSelectedMember(null);
      Alert.alert("Success", "Officer role updated.");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update role.",
      );
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (userId: number) =>
      membershipService.removeMember(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
      setIsRemoveDialogVisible(false);
      setMemberToRemove(null);
      Alert.alert("Success", "Officer removed from club.");
    },
    onError: (error: any) => {
      setIsRemoveDialogVisible(false);
      setMemberToRemove(null);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to remove officer.",
      );
    },
  });

  const handleOpenEdit = (member: any) => {
    if (!canManage) return;
    setSelectedMember(member);
    setIsEditModalVisible(true);
  };

  const handleTriggerRemove = (member: any) => {
    if (!canManage || !member) return;
    setMemberToRemove(member);
    setIsRemoveDialogVisible(true);
  };

  const confirmRemoveMember = () => {
    if (!memberToRemove) return;
    const targetId = memberToRemove?.user_id || memberToRemove?.id;
    removeMemberMutation.mutate(targetId);
  };

  if (isLoading) {
    return (
      <View className="py-10 items-center justify-center">
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  const membersList = Array.isArray(rawData)
    ? rawData
    : rawData?.data || rawData?.members || [];

  const officersList = membersList.filter(
    (member: any) =>
      member?.role === "officer" ||
      member?.pivot?.role === "officer" ||
      member?.role === "admin" ||
      member?.pivot?.role === "admin",
  );

  return (
    <View className="flex-1 mt-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider">
          Active Officers
        </Text>
        <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
          {officersList.length} Total
        </Text>
      </View>

      {officersList.length === 0 ? (
        <View className="py-10 items-center border border-dashed border-border dark:border-dark-border rounded-xl">
          <Text className="text-muted-fg dark:text-dark-muted-fg py-8">
            No active officers yet.
          </Text>
        </View>
      ) : (
        officersList.map((member: any, index: number) => (
          <MemberListItem
            key={
              member?.user_id?.toString() ||
              member?.id?.toString() ||
              index.toString()
            }
            member={member}
            primaryColor={primaryColor}
            onEdit={canManage ? handleOpenEdit : undefined}
            onRemove={canManage ? handleTriggerRemove : undefined}
            isRemoving={
              removeMemberMutation.isPending &&
              (memberToRemove?.user_id === member?.user_id ||
                memberToRemove?.id === member?.id)
            }
          />
        ))
      )}

      {canManage && (
        <>
          <EditRoleModal
            isVisible={isEditModalVisible}
            member={selectedMember}
            onClose={() => {
              setIsEditModalVisible(false);
              setSelectedMember(null);
            }}
            onSave={(data: any) => updateRoleMutation.mutate(data)}
            isPending={updateRoleMutation.isPending}
          />
          <CustomAlertDialog
            visible={isRemoveDialogVisible}
            title="Remove Officer"
            message={`Are you sure you want to remove ${
              memberToRemove?.first_name || "this user"
            } from the club? They will lose access to all club activities.`}
            cancelText="No"
            confirmText="Yes"
            isDestructive={true}
            isLoading={removeMemberMutation.isPending}
            onCancel={() => {
              setIsRemoveDialogVisible(false);
              setMemberToRemove(null);
            }}
            onConfirm={confirmRemoveMember}
          />
        </>
      )}
    </View>
  );
};
