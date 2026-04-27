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
  const previewMembers = (club.users || []).slice(0, 3);
  const remainingCount = Math.max(0, memberCount - previewMembers.length);
  const isApproved = membershipStatus === "approved";

  const renderActionButton = () => {
    if (isApproved) {
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
        className="bg-primary/10 dark:bg-dark-primary/20 px-4 py-2 rounded-lg"
        onPress={() => onApplyClub(club.id)}
        disabled={isApplying}
      >
        <Text className="text-primary dark:text-dark-primary font-semibold text-sm">
          Apply
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="border border-border dark:border-dark-border rounded-2xl p-4 mb-4 bg-card dark:bg-dark-card">
      <View className="flex-row items-center">
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
            className="text-base font-bold text-card-fg dark:text-dark-card-fg"
            numberOfLines={1}
          >
            {club.name}
          </Text>

          {isApproved && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="people" size={14} color={mutedFgColor} />
              <Text className="text-muted-fg dark:text-dark-muted-fg text-xs ml-1">
                {memberCount} active members
              </Text>
            </View>
          )}

          {!isApproved && (
            <View className="mt-1">
              <Ionicons name="people" size={16} color={mutedFgColor} />
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        {isApproved ? (
          <View className="flex-row items-center">
            {previewMembers.map((member, index) => (
              <View
                key={member.id}
                className="w-8 h-8 rounded-full border-2 border-card dark:border-dark-card overflow-hidden bg-muted dark:bg-dark-muted"
                style={{
                  marginLeft: index === 0 ? 0 : -10,
                  zIndex: previewMembers.length - index,
                }}
              >
                {member.avatar ? (
                  <Image
                    source={{ uri: member.avatar }}
                    className="w-full h-full"
                  />
                ) : (
                  <View className="w-full h-full bg-primary/20 dark:bg-dark-primary/30 items-center justify-center">
                    <Text className="text-[10px] font-bold text-primary dark:text-dark-primary">
                      {member.first_name?.[0]}
                      {member.last_name?.[0]}
                    </Text>
                  </View>
                )}
              </View>
            ))}

            {remainingCount > 0 && (
              <View
                className="w-8 h-8 rounded-full bg-muted dark:bg-dark-muted border-2 border-card dark:border-dark-card items-center justify-center"
                style={{ marginLeft: -10, zIndex: 0 }}
              >
                <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg font-bold">
                  +{remainingCount}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View />
        )}

        {renderActionButton()}
      </View>
    </View>
  );
}
