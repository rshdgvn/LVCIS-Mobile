import { Club } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ClubCardProps {
  club: Club;
  onAccessClub: (clubId: number) => void;
}

export function ClubCard({ club, onAccessClub }: ClubCardProps) {
  const memberCount = club.approved_users_count || 0;

  return (
    <View className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-4 bg-white dark:bg-gray-900 shadow-sm">
      <View className="flex-row justify-between">
        <View className="flex-row flex-1">
          <Image
            source={{ uri: club.logo_url || "https://via.placeholder.com/150" }}
            className="w-16 h-16 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50"
          />

          <View className="ml-4 flex-1">
            <View className="bg-blue-100 dark:bg-blue-900/30 self-start px-3 py-1 rounded-full mb-1">
              <Text className="text-blue-600 dark:text-blue-400 text-xs font-medium capitalize">
                {club.category.replace(/_/g, " ")}
              </Text>
            </View>

            <Text
              className="text-lg font-bold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {club.name}
            </Text>

            <View className="flex-row items-center mt-1">
              <Ionicons name="people" size={14} color="#6b7280" />
              <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                {memberCount} active members
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        <View className="flex-row items-center">
          {memberCount === 0 ? (
            <Text className="text-xs text-gray-400 italic ml-2">
              No members yet
            </Text>
          ) : (
            <>
              {memberCount >= 1 && (
                <View className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white dark:border-gray-900 items-center justify-center">
                  <Ionicons name="person" size={14} color="#3b82f6" />
                </View>
              )}

              {memberCount >= 2 && (
                <View className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white dark:border-gray-900 -ml-3 items-center justify-center">
                  <Ionicons name="person" size={14} color="#1d4ed8" />
                </View>
              )}

              {memberCount > 2 && (
                <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 -ml-3 items-center justify-center">
                  <Text className="text-[10px] text-gray-600 dark:text-gray-400 font-bold">
                    +{memberCount - 2}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
          onPress={() => onAccessClub(club.id)}
        >
          <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
            Access Club
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}