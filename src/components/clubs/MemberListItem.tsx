import { useTheme } from "@/src/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export const MemberListItem = ({
  member,
  onEdit,
  onRemove,
  isRemoving,
}: any) => {
  if (!member) return null;

  const { mutedFgColor } = useTheme();

  return (
    <View className="flex-row items-center bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-2xl p-4 mb-3 shadow-sm">
      <Image
        source={{ uri: member?.avatar || "https://via.placeholder.com/150" }}
        className="w-12 h-12 rounded-full border border-border/50 dark:border-dark-border/50 bg-muted dark:bg-dark-muted"
      />

      <View className="ml-4 flex-1 justify-center">
        <Text
          className="text-base font-bold text-foreground dark:text-dark-fg"
          numberOfLines={1}
        >
          {member?.first_name} {member?.last_name}
        </Text>

        <View className="flex-row items-center mt-0.5">
          <Text className="text-sm text-muted-fg dark:text-dark-muted-fg">
            {member?.course || "Course"} {member?.year_level || ""}
          </Text>

          {member?.officer_title && (
            <Text className="text-sm font-semibold text-primary dark:text-dark-primary ml-1">
              • {member.officer_title}
            </Text>
          )}
        </View>
      </View>

      <View className="flex-row items-center ml-2">
        {onEdit && (
          <TouchableOpacity onPress={() => onEdit(member)} className="p-2">
            <Ionicons
              name="document-text-outline"
              size={20}
              color={mutedFgColor}
            />
          </TouchableOpacity>
        )}
        {onRemove && (
          <TouchableOpacity
            onPress={() => onRemove(member)}
            className="p-2 ml-1"
            disabled={isRemoving}
          >
            <Ionicons
              name="person-remove-outline"
              size={20}
              color={mutedFgColor}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
