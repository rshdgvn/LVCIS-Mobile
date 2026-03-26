import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const EditRoleModal = ({
  isVisible,
  member,
  onClose,
  onSave,
  isPending,
}: any) => {
  const [role, setRole] = useState<"member" | "officer">("member");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (member) {
      setRole(member.role === "officer" ? "officer" : "member");
      setTitle(member.officer_title || "");
    }
  }, [member]);

  const handleSave = () => {
    if (!member) return;
    onSave({
      userId: member?.user_id || member?.id,
      role,
      officerTitle: role === "officer" ? title : undefined,
    });
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-card dark:bg-dark-card w-full rounded-2xl p-6 shadow-lg">
          <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
            Edit Member Role
          </Text>
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-6">
            Update role for {member?.first_name} {member?.last_name}
          </Text>
          <View className="flex-row justify-between mb-4 gap-x-3">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl border items-center ${
                role === "member"
                  ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                  : "border-border dark:border-dark-border"
              }`}
              onPress={() => setRole("member")}
            >
              <Text
                className={`font-semibold ${role === "member" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
              >
                Member
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl border items-center ${
                role === "officer"
                  ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                  : "border-border dark:border-dark-border"
              }`}
              onPress={() => setRole("officer")}
            >
              <Text
                className={`font-semibold ${role === "officer" ? "text-primary dark:text-dark-primary" : "text-muted-fg dark:text-dark-muted-fg"}`}
              >
                Officer
              </Text>
            </TouchableOpacity>
          </View>
          {role === "officer" && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground dark:text-dark-fg mb-2">
                Officer Title (Optional)
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. President, Secretary"
                placeholderTextColor="#9ca3af"
                className="bg-muted dark:bg-dark-muted text-foreground dark:text-dark-fg px-4 py-3 rounded-xl border border-border dark:border-dark-border"
              />
            </View>
          )}
          <View className="flex-row mt-2 gap-x-3">
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl border border-border dark:border-dark-border items-center"
              onPress={onClose}
              disabled={isPending}
            >
              <Text className="text-foreground dark:text-dark-fg font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3.5 rounded-xl items-center ${isPending ? "bg-primary/50" : "bg-primary dark:bg-dark-primary"}`}
              onPress={handleSave}
              disabled={isPending}
            >
              {isPending ? (
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
  );
};
