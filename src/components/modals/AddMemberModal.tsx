import { api } from "@/src/api/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserResult {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
}

export const AddMemberModal = ({
  isVisible,
  onClose,
  onAdd,
  isPending,
  currentMembers = [],
}: any) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null);
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [role, setRole] = useState<"member" | "officer">("member");
  const [title, setTitle] = useState("");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isVisible) {
      setSearchQuery("");
      setSelectedUser(null);
      setSearchResults([]);
      setShowSuggestions(false);
      setRole("member");
      setTitle("");
    }
  }, [isVisible]);

  useEffect(() => {
    if (selectedUser) return;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const { data } = await api.get<UserResult[]>("/users", {
          params: { search: searchQuery },
        });
        const available = data.filter(
          (u) => !currentMembers.some((m: any) => m.id === u.id),
        );
        setSearchResults(available.slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        console.error("User search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const handleSelectUser = (user: UserResult) => {
    setSelectedUser(user);
    setSearchQuery(user.email);
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const handleClearSelection = () => {
    setSelectedUser(null);
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
  };

  const handleAdd = () => {
    const email = selectedUser?.email || searchQuery.trim();
    if (!email) return;
    onAdd({
      email,
      role,
      officerTitle: role === "officer" ? title : undefined,
    });
  };

  const avatarUri = (user: UserResult) =>
    user.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user.first_name} ${user.last_name}`,
    )}&background=111&color=fff`;

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
            Search by name or email to invite a user.
          </Text>

          <View className="mb-1">
            <Text className="text-sm font-semibold text-foreground dark:text-dark-fg mb-2">
              User Email
            </Text>
            <View className="flex-row items-center bg-muted dark:bg-dark-muted border border-border dark:border-dark-border rounded-xl px-3">
              <Ionicons name="search" size={15} color="#9ca3af" />
              <TextInput
                value={searchQuery}
                onChangeText={(text) => {
                  if (selectedUser && text !== selectedUser.email) {
                    setSelectedUser(null);
                  }
                  setSearchQuery(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="Search by name or email..."
                placeholderTextColor="#9ca3af"
                className="flex-1 text-foreground dark:text-dark-fg px-2 py-3"
              />
              {isSearching && (
                <ActivityIndicator size="small" color="#9ca3af" />
              )}
              {selectedUser && !isSearching && (
                <TouchableOpacity onPress={handleClearSelection}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {selectedUser && (
            <View className="flex-row items-center bg-primary/10 dark:bg-dark-primary/20 border border-primary dark:border-dark-primary rounded-xl px-3 py-2 mt-2">
              <Image
                source={{ uri: avatarUri(selectedUser) }}
                className="w-7 h-7 rounded-full mr-2"
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-primary dark:text-dark-primary">
                  {selectedUser.first_name} {selectedUser.last_name}
                </Text>
                <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
                  {selectedUser.email}
                </Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color="#3b82f6" />
            </View>
          )}

          {showSuggestions && searchResults.length > 0 && (
            <View className="border border-border dark:border-dark-border rounded-xl overflow-hidden mt-1 bg-card dark:bg-dark-card">
              <FlatList
                data={searchResults}
                keyExtractor={(u) => u.id.toString()}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectUser(item)}
                    className={`flex-row items-center px-3 py-2.5 ${
                      index < searchResults.length - 1
                        ? "border-b border-border dark:border-dark-border"
                        : ""
                    }`}
                  >
                    <Image
                      source={{ uri: avatarUri(item) }}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-foreground dark:text-dark-fg">
                        {item.first_name} {item.last_name}
                      </Text>
                      <Text className="text-xs text-muted-fg dark:text-dark-muted-fg">
                        {item.email}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {!isSearching &&
            !selectedUser &&
            searchQuery.trim().length > 1 &&
            searchResults.length === 0 &&
            !showSuggestions && (
              <Text className="text-xs text-muted-fg dark:text-dark-muted-fg text-center mt-2">
                No users found. You can still type the full email to add.
              </Text>
            )}

          <View className="flex-row justify-between mt-4 mb-4 gap-x-3">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl border items-center ${
                role === "member"
                  ? "border-primary bg-primary/10 dark:bg-dark-primary/20"
                  : "border-border dark:border-dark-border"
              }`}
              onPress={() => setRole("member")}
            >
              <Text
                className={`font-semibold ${
                  role === "member"
                    ? "text-primary dark:text-dark-primary"
                    : "text-muted-fg dark:text-dark-muted-fg"
                }`}
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
                className={`font-semibold ${
                  role === "officer"
                    ? "text-primary dark:text-dark-primary"
                    : "text-muted-fg dark:text-dark-muted-fg"
                }`}
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
              className={`flex-1 py-3.5 rounded-xl items-center ${
                isPending || (!selectedUser && !searchQuery.trim())
                  ? "bg-primary/50"
                  : "bg-primary dark:bg-dark-primary"
              }`}
              onPress={handleAdd}
              disabled={isPending || (!selectedUser && !searchQuery.trim())}
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
