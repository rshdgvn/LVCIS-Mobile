import { useTheme } from "@/src/hooks/useTheme";
import { membershipService } from "@/src/services/membershipService"; // Make sure this path is correct!
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

  // Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [roleMode, setRoleMode] = useState<"member" | "officer">("member");
  const [officerTitle, setOfficerTitle] = useState("");

  // Fetch Members
  const { data: rawData, isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: () => membershipService.getClubMembers(clubId),
  });

  // Mutation for updating role
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
      // Refresh the list immediately
      queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
      handleCloseModal();
      Alert.alert("Success", "Member role updated successfully!");
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Error", "Failed to update member role.");
    },
  });

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

  const handleOpenEdit = (member: any) => {
    setSelectedMember(member);
    setRoleMode(member.role === "officer" ? "officer" : "member");
    setOfficerTitle(member.officer_title || "");
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedMember(null);
    setRoleMode("member");
    setOfficerTitle("");
  };

  const handleSaveRole = () => {
    if (!selectedMember) return;

    // Fallback to id if user_id is missing for some reason
    const targetId = selectedMember.user_id || selectedMember.id;

    updateRoleMutation.mutate({
      userId: targetId,
      role: roleMode,
      officerTitle: roleMode === "officer" ? officerTitle : undefined,
    });
  };

  return (
    <View className="flex-1 mt-2">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg uppercase tracking-wider">
          Active Members
        </Text>
        <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg">
          {membersList.length} Total
        </Text>
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

                  {/* Edit Button */}
                  <TouchableOpacity
                    onPress={() => handleOpenEdit(member)}
                    className="p-1"
                  >
                    <Ionicons name="pencil" size={16} color={primaryColor} />
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

      {/* Edit Role Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
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

            {/* Role Selection */}
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
                  className={`font-semibold ${
                    roleMode === "member"
                      ? "text-primary dark:text-dark-primary"
                      : "text-muted-fg dark:text-dark-muted-fg"
                  }`}
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
                  className={`font-semibold ${
                    roleMode === "officer"
                      ? "text-primary dark:text-dark-primary"
                      : "text-muted-fg dark:text-dark-muted-fg"
                  }`}
                >
                  Officer
                </Text>
              </TouchableOpacity>
            </View>

            {/* Optional Officer Title Input */}
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

            {/* Action Buttons */}
            <View className="flex-row mt-2 gap-x-3">
              <TouchableOpacity
                className="flex-1 py-3.5 rounded-xl border border-border dark:border-dark-border items-center"
                onPress={handleCloseModal}
                disabled={updateRoleMutation.isPending}
              >
                <Text className="text-foreground dark:text-dark-fg font-semibold">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 py-3.5 rounded-xl items-center ${
                  updateRoleMutation.isPending
                    ? "bg-primary/50 dark:bg-dark-primary/50"
                    : "bg-primary dark:bg-dark-primary"
                }`}
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
