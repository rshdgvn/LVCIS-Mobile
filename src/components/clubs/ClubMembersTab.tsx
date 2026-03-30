import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AddMemberModal } from "../modals/AddMemberModal";
import { EditRoleModal } from "../modals/EditRoleModal";
import { MemberListItem } from "./MemberListItem";
import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";

interface Props {
  clubId: number;
}

export const ClubMembersTab = ({ clubId }: Props) => {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

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
      Alert.alert("Success", "Member role updated.");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update role.",
      );
    },
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: {
      email: string;
      role: "member" | "officer";
      officerTitle?: string;
    }) => membershipService.addMember(clubId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
      setIsAddModalVisible(false);
      Alert.alert("Success", "Member added successfully.");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to add member.",
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
      Alert.alert("Success", "Member removed.");
    },
    onError: (error: any) => {
      setIsRemoveDialogVisible(false);
      setMemberToRemove(null);
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to remove member.",
      );
    },
  });

  const handleOpenEdit = (member: any) => {
    setSelectedMember(member);
    setIsEditModalVisible(true);
  };

  const handleTriggerRemove = (member: any) => {
    if (!member) return;
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

  return (
    <View className="flex-1 mt-2">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider">
            Active Members
          </Text>
          <Text className="text-xs text-muted-fg dark:text-dark-muted-fg mt-0.5">
            {membersList.length} Total
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsAddModalVisible(true)}
          className="flex-row items-center bg-primary/10 dark:bg-dark-primary/20 px-3 py-1.5 rounded-full"
        >
          <Ionicons name="add" size={16} color={primaryColor} />
          <Text className="text-primary dark:text-dark-primary font-semibold text-sm ml-1">
            Add
          </Text>
        </TouchableOpacity>
      </View>
      {membersList.length === 0 ? (
        <View className="py-10 items-center border border-dashed border-border dark:border-dark-border rounded-xl">
          <Text className="text-muted-fg dark:text-dark-muted-fg py-8">
            No active members yet.
          </Text>
        </View>
      ) : (
        membersList.map((member: any, index: number) => (
          <MemberListItem
            key={
              member?.user_id?.toString() ||
              member?.id?.toString() ||
              index.toString()
            }
            member={member}
            primaryColor={primaryColor}
            onEdit={handleOpenEdit}
            onRemove={handleTriggerRemove}
            isRemoving={
              removeMemberMutation.isPending &&
              (memberToRemove?.user_id === member?.user_id ||
                memberToRemove?.id === member?.id)
            }
          />
        ))
      )}
      <AddMemberModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAdd={(data: any) => addMemberMutation.mutate(data)}
        isPending={addMemberMutation.isPending}
        currentMembers={membersList} 
      />
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
        title="Remove Member"
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
    </View>
  );
};
