import { useTheme } from "@/src/hooks/useTheme";
import { Club } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ClubCardProps {
  club: Club;
  membershipStatus?: "approved" | "pending" | "rejected" | null;
  onAccessClub: (clubId: number) => void;
  onApplyClub: (clubId: number) => void;
  isApplying?: boolean;
}

export function ClubCard({
  club,
  membershipStatus,
  onAccessClub,
  onApplyClub,
  isApplying = false,
}: ClubCardProps) {
  const { mutedFgColor, primaryColor } = useTheme();
  const memberCount = club.approved_users_count || 0;

  const renderActionButton = () => {
    if (membershipStatus === "approved") {
      return (
        <TouchableOpacity
          className="bg-primary/10 dark:bg-dark-primary/20 px-4 py-2 rounded-lg"
          onPress={() => onAccessClub(club.id)}
        >
          <Text className="text-primary dark:text-dark-primary font-semibold text-sm">
            Access Club
          </Text>
        </TouchableOpacity>
      );
    }

    if (membershipStatus === "pending" || isApplying) {
      return (
        <View className="bg-orange-500/10 dark:bg-orange-500/20 px-4 py-2 rounded-lg opacity-80">
          <Text className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
            {isApplying ? "Applying..." : "Pending"}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        className="bg-primary dark:bg-dark-primary px-4 py-2 rounded-lg"
        onPress={() => onApplyClub(club.id)}
        disabled={isApplying}
      >
        <Text className="text-primary-fg dark:text-dark-primary-fg font-semibold text-sm">
          Apply
        </Text>
      </TouchableOpacity>
    );
  };

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

        {renderActionButton()}
      </View>
    </View>
  );
}
