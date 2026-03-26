import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const MemberListItem = ({ member, primaryColor, onEdit, onRemove, isRemoving }: any) => {
  if (!member) return null;

  return (
    <View className="flex-row items-center border-b border-border/50 dark:border-dark-border/50 py-3 mb-1">
      <Image
        source={{ uri: member?.avatar || "https://via.placeholder.com/150" }}
        className="w-12 h-12 rounded-full border border-border dark:border-dark-border bg-muted dark:bg-dark-muted"
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-base font-bold text-foreground dark:text-dark-fg flex-1 mr-2"
            numberOfLines={1}
          >
            {member?.first_name} {member?.last_name}
          </Text>
          <View className="flex-row items-center">
            <View
              className={`px-2 py-0.5 rounded-full mr-2 ${
                member?.role === "officer" || member?.role === "admin"
                  ? "bg-primary/10 dark:bg-dark-primary/20"
                  : "bg-muted dark:bg-dark-muted"
              }`}
            >
              <Text
                className={`text-[10px] font-bold uppercase ${
                  member?.role === "officer" || member?.role === "admin"
                    ? "text-primary dark:text-dark-primary"
                    : "text-muted-fg dark:text-dark-muted-fg"
                }`}
              >
                {member?.role || "Member"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => onEdit(member)} className="p-1">
              <Ionicons name="pencil" size={16} color={primaryColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onRemove(member)}
              className="p-1 ml-1"
              disabled={isRemoving}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mt-0.5">
          {member?.course || "No Course"} • {member?.year_level || "N/A"}
          {member?.officer_title ? ` • ${member.officer_title}` : ""}
        </Text>
      </View>
    </View>
  );
};