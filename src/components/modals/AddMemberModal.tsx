import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export const AddMemberModal = ({
  isVisible,
  onClose,
  onAdd,
  isPending,
}: any) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "officer">("member");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (isVisible) {
      setEmail("");
      setRole("member");
      setTitle("");
    }
  }, [isVisible]);

  const handleAdd = () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter an email address.");
      return;
    }
    onAdd({
      email: email.trim(),
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
              value={email}
              onChangeText={setEmail}
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
                placeholder="e.g. Treasurer"
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
              onPress={handleAdd}
              disabled={isPending}
            >
              {isPending ? (
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
  );
};
