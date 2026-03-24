import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService"; 
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  clubId: number;
}

export const ClubMembersTab = ({ clubId }: Props) => {
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [roleMode, setRoleMode] = useState<"member" | "officer">("member");
  const [officerTitle, setOfficerTitle] = useState("");

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addRoleMode, setAddRoleMode] = useState<"member" | "officer">(
    "member",
  );
  const [addOfficerTitle, setAddOfficerTitle] = useState("");

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
      handleCloseEditModal();
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
      handleCloseAddModal();
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
      Alert.alert("Success", "Member removed.");
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to remove member.",
      );
    },
  });

  const handleOpenEdit = (member: any) => {
    setSelectedMember(member);
    setRoleMode(member.role === "officer" ? "officer" : "member");
    setOfficerTitle(member.officer_title || "");
    setIsEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedMember(null);
    setRoleMode("member");
    setOfficerTitle("");
  };

  const handleSaveRole = () => {
    if (!selectedMember) return;
    const targetId = selectedMember.user_id || selectedMember.id;
    updateRoleMutation.mutate({
      userId: targetId,
      role: roleMode,
      officerTitle: roleMode === "officer" ? officerTitle : undefined,
    });
  };

  const handleCloseAddModal = () => {
    setIsAddModalVisible(false);
    setAddEmail("");
    setAddRoleMode("member");
    setAddOfficerTitle("");
  };

  const handleAddMember = () => {
    if (!addEmail.trim()) {
      Alert.alert("Validation", "Please enter an email address.");
      return;
    }
    addMemberMutation.mutate({
      email: addEmail.trim(),
      role: addRoleMode,
      officerTitle: addRoleMode === "officer" ? addOfficerTitle : undefined,
    });
  };

  const handleRemoveMember = (member: any) => {
    const targetId = member.user_id || member.id;
    Alert.alert(
      "Remove Member",
      `Are you sure you want to remove ${member.first_name} from the club?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeMemberMutation.mutate(targetId),
        },
      ],
    );
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
        membersList.map((member: any) => (
          <View
            key={member.user_id || member.id || Math.random().toString()}
            className="flex-row items-center border-b border-border/50 dark:border-dark-border/50 py-3 mb-1"
          >
            <Image
              source={{
                uri: member.avatar || "https://via.placeholder.com/150",
              }}
              className="w-12 h-12 rounded-full border border-border dark:border-dark-border bg-muted dark:bg-dark-muted"
            />

            <View className="ml-3 flex-1">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-base font-bold text-foreground dark:text-dark-fg flex-1 mr-2"
                  numberOfLines={1}
                >
                  {member.first_name} {member.last_name}
                </Text>

                <View className="flex-row items-center">
                  <View
                    className={`px-2 py-0.5 rounded-full mr-2 ${
                      member.role === "officer" || member.role === "admin"
                        ? "bg-primary/10 dark:bg-dark-primary/20"
                        : "bg-muted dark:bg-dark-muted"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold uppercase ${
                        member.role === "officer" || member.role === "admin"
                          ? "text-primary dark:text-dark-primary"
                          : "text-muted-fg dark:text-dark-muted-fg"
                      }`}
                    >
                      {member.role || "Member"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleOpenEdit(member)}
                    className="p-1"
                  >
                    <Ionicons name="pencil" size={16} color={primaryColor} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member)}
                    className="p-1 ml-1"
                    disabled={removeMemberMutation.isPending}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mt-0.5">
                {member.course || "No Course"} • {member.year_level || "N/A"}
                {member.officer_title ? ` • ${member.officer_title}` : ""}
              </Text>
            </View>
          </View>
        ))
      )}

      <Modal
        visible={isAddModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAddModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-card dark:bg-dark-card w-full rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
              Add New Member
            </Text>
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-6">
              Invite a user to the club via their email.
            </Text>

            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground dark:text-dark-fg mb-2">
                User Email
              </Text>
              <TextInput
                value={addEmail}
                onChangeText={setAddEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="student@example.com"
                placeholderTextColor="#9ca3af"
                className="bg-muted dark:bg-dark-muted text-foreground dark:text-dark-fg px-4 py-3 rounded-xl border border-border dark:border-dark-border"
              />
            </View>

            <View className="flex-row justify-between mb-4 gap-x-3">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  addRoleMode === "member"
                    ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                    : "border-border dark:border-dark-border"
                }`}
                onPress={() => setAddRoleMode("member")}
              >
                <Text
                  className={`font-semibold ${addRoleMode === "member" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
                >
                  Member
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  addRoleMode === "officer"
                    ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                    : "border-border dark:border-dark-border"
                }`}
                onPress={() => setAddRoleMode("officer")}
              >
                <Text
                  className={`font-semibold ${addRoleMode === "officer" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
                >
                  Officer
                </Text>
              </TouchableOpacity>
            </View>

            {addRoleMode === "officer" && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-foreground dark:text-dark-fg mb-2">
                  Officer Title (Optional)
                </Text>
                <TextInput
                  value={addOfficerTitle}
                  onChangeText={setAddOfficerTitle}
                  placeholder="e.g. Treasurer"
                  placeholderTextColor="#9ca3af"
                  className="bg-muted dark:bg-dark-muted text-foreground dark:text-dark-fg px-4 py-3 rounded-xl border border-border dark:border-dark-border"
                />
              </View>
            )}

            <View className="flex-row mt-2 gap-x-3">
              <TouchableOpacity
                className="flex-1 py-3.5 rounded-xl border border-border dark:border-dark-border items-center"
                onPress={handleCloseAddModal}
                disabled={addMemberMutation.isPending}
              >
                <Text className="text-foreground dark:text-dark-fg font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3.5 rounded-xl items-center ${addMemberMutation.isPending ? "bg-primary/50" : "bg-primary dark:bg-dark-primary"}`}
                onPress={handleAddMember}
                disabled={addMemberMutation.isPending}
              >
                {addMemberMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-primary-fg dark:text-dark-primary-fg font-semibold">
                    Add Member
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseEditModal}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-card dark:bg-dark-card w-full rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
              Edit Member Role
            </Text>
            <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-6">
              Update role for {selectedMember?.first_name}{" "}
              {selectedMember?.last_name}
            </Text>

            <View className="flex-row justify-between mb-4 gap-x-3">
              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  roleMode === "member"
                    ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                    : "border-border dark:border-dark-border"
                }`}
                onPress={() => setRoleMode("member")}
              >
                <Text
                  className={`font-semibold ${roleMode === "member" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
                >
                  Member
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3 rounded-xl border items-center ${
                  roleMode === "officer"
                    ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                    : "border-border dark:border-dark-border"
                }`}
                onPress={() => setRoleMode("officer")}
              >
                <Text
                  className={`font-semibold ${roleMode === "officer" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
                >
                  Officer
                </Text>
              </TouchableOpacity>
            </View>

            {roleMode === "officer" && (
              <View className="mb-6">
                <Text className="text-sm font-semibold text-foreground dark:text-dark-fg mb-2">
                  Officer Title (Optional)
                </Text>
                <TextInput
                  value={officerTitle}
                  onChangeText={setOfficerTitle}
                  placeholder="e.g. President, Secretary"
                  placeholderTextColor="#9ca3af"
                  className="bg-muted dark:bg-dark-muted text-foreground dark:text-dark-fg px-4 py-3 rounded-xl border border-border dark:border-dark-border"
                />
              </View>
            )}

            <View className="flex-row mt-2 gap-x-3">
              <TouchableOpacity
                className="flex-1 py-3.5 rounded-xl border border-border dark:border-dark-border items-center"
                onPress={handleCloseEditModal}
                disabled={updateRoleMutation.isPending}
              >
                <Text className="text-foreground dark:text-dark-fg font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3.5 rounded-xl items-center ${updateRoleMutation.isPending ? "bg-primary/50" : "bg-primary dark:bg-dark-primary"}`}
                onPress={handleSaveRole}
                disabled={updateRoleMutation.isPending}
              >
                {updateRoleMutation.isPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-primary-fg dark:text-dark-primary-fg font-semibold">
                    Save Changes
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
