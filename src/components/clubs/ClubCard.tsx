import { useTheme } from "@/src/hooks/useTheme"; // Adjust path if needed
import { Club } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ClubCardProps {
  club: Club;
  onAccessClub: (clubId: number) => void;
}

export function ClubCard({ club, onAccessClub }: ClubCardProps) {
  const { mutedFgColor, primaryColor } = useTheme();
  const memberCount = club.approved_users_count || 0;

  return (
    <View className="border border-border dark:border-dark-border rounded-2xl p-4 mb-4 bg-card dark:bg-dark-card shadow-sm">
      <View className="flex-row justify-between">
        <View className="flex-row flex-1">
          <Image
            source={{ uri: club.logo_url || "https://via.placeholder.com/150" }}
            className="w-16 h-16 rounded-full border border-border dark:border-dark-border bg-muted dark:bg-dark-muted"
          />

          <View className="ml-4 flex-1">
            <View className="bg-primary/10 dark:bg-dark-primary/20 self-start px-3 py-1 rounded-full mb-1">
              <Text className="text-primary dark:text-dark-primary text-xs font-medium capitalize">
                {club.category.replace(/_/g, " ")}
              </Text>
            </View>

            <Text
              className="text-lg font-bold text-card-fg dark:text-dark-card-fg"
              numberOfLines={1}
            >
              {club.name}
            </Text>

            <View className="flex-row items-center mt-1">
              <Ionicons name="people" size={14} color={mutedFgColor} />
              <Text className="text-muted-fg dark:text-dark-muted-fg text-xs ml-1">
                {memberCount} active members
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={mutedFgColor} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          {memberCount === 0 ? (
            <Text className="text-xs text-muted-fg dark:text-dark-muted-fg italic ml-2">
              No members yet
            </Text>
          ) : (
            <>
              {memberCount >= 1 && (
                <View className="w-8 h-8 rounded-full bg-primary/20 dark:bg-dark-primary/30 border-2 border-card dark:border-dark-card items-center justify-center">
                  <Ionicons name="person" size={14} color={primaryColor} />
                </View>
              )}

              {memberCount >= 2 && (
                <View className="w-8 h-8 rounded-full bg-primary/30 dark:bg-dark-primary/40 border-2 border-card dark:border-dark-card -ml-3 items-center justify-center">
                  <Ionicons name="person" size={14} color={primaryColor} />
                </View>
              )}

              {memberCount > 2 && (
                <View className="w-8 h-8 rounded-full bg-muted dark:bg-dark-muted border-2 border-card dark:border-dark-card -ml-3 items-center justify-center">
                  <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg font-bold">
                    +{memberCount - 2}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          className="bg-primary/10 dark:bg-dark-primary/20 px-4 py-2 rounded-lg"
          onPress={() => onAccessClub(club.id)}
        >
          <Text className="text-primary dark:text-dark-primary font-semibold text-sm">
            Access Club
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
