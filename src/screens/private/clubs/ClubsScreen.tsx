import { ClubViewFilter } from "@/src/hooks/useClubs";
import { Club, ClubCategory } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  clubs: Club[] | undefined;
  isLoading: boolean;
  selectedCategory: ClubCategory | undefined;
  onSelectCategory: (category: ClubCategory | undefined) => void;
  viewFilter: ClubViewFilter;
  onSelectViewFilter: (filter: ClubViewFilter) => void;
  onAccessClub: (clubId: number) => void;
}

export default function ClubsScreen({
  clubs,
  isLoading,
  selectedCategory,
  onSelectCategory,
  viewFilter,
  onSelectViewFilter,
  onAccessClub,
}: Props) {
  const getFilterLabel = () => {
    switch (viewFilter) {
      case "my":
        return "My Clubs";
      case "pending":
        return "Pending";
      case "other":
        return "Other Clubs";
      default:
        return "All Clubs";
    }
  };

  const handleViewPress = () => {
    Alert.alert("Filter Clubs", "Choose which clubs to display:", [
      { text: "All Clubs", onPress: () => onSelectViewFilter("all") },
      { text: "My Clubs", onPress: () => onSelectViewFilter("my") },
      {
        text: "Pending Requests",
        onPress: () => onSelectViewFilter("pending"),
      },
      { text: "Other Clubs", onPress: () => onSelectViewFilter("other") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCategoryPress = () => {
    Alert.alert("Select Category", "Filter by club category:", [
      { text: "All Categories", onPress: () => onSelectCategory(undefined) },
      { text: "Academics", onPress: () => onSelectCategory("academics") },
      {
        text: "Culture & Performing Arts",
        onPress: () => onSelectCategory("culture_and_performing_arts"),
      },
      {
        text: "Socio-Politics",
        onPress: () => onSelectCategory("socio_politics"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-bg px-5 pt-4">
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-gray-500 text-lg">Welcome to,</Text>
          <Text className="text-2xl font-bold text-black dark:text-white">
            Clubs
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          className="border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2 flex-row items-center"
          onPress={handleCategoryPress}
        >
          <Text className="text-gray-500 dark:text-gray-400 mr-2">
            Category:
          </Text>
          <Text className="text-blue-500 font-semibold capitalize">
            {selectedCategory ? selectedCategory.replace(/_/g, " ") : "All"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#3b82f6"
            style={{ marginLeft: 5 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 px-5 py-2.5 rounded-xl flex-row items-center"
          onPress={handleViewPress}
        >
          <Text className="text-white font-semibold mr-1">
            {getFilterLabel()}
          </Text>
          <Ionicons name="chevron-down" size={14} color="white" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" className="mt-10" />
      ) : (
        <FlatList
          data={clubs}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No clubs found for this filter.
            </Text>
          }
          renderItem={({ item }) => (
            <View className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 mb-4 bg-white dark:bg-gray-900 shadow-sm">
              <View className="flex-row justify-between">
                <View className="flex-row flex-1">
                  <Image
                    source={{
                      uri: item.logo_url || "https://via.placeholder.com/150",
                    }}
                    className="w-16 h-16 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50"
                  />

                  <View className="ml-4 flex-1">
                    <View className="bg-blue-100 dark:bg-blue-900/30 self-start px-3 py-1 rounded-full mb-1">
                      <Text className="text-blue-600 dark:text-blue-400 text-xs font-medium capitalize">
                        {item.category.replace(/_/g, " ")}
                      </Text>
                    </View>

                    <Text
                      className="text-lg font-bold text-gray-900 dark:text-white"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>

                    <View className="flex-row items-center mt-1">
                      <Ionicons name="people" size={14} color="#6b7280" />
                      <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        {item.approved_users_count || 0} active members
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between items-center mt-4">
                <View className="flex-row items-center">
                  {(item.approved_users_count || 0) === 0 ? (
                    <Text className="text-xs text-gray-400 italic ml-2">
                      No members yet
                    </Text>
                  ) : (
                    <>
                      {(item.approved_users_count || 0) >= 1 && (
                        <View className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white dark:border-gray-900 items-center justify-center">
                          <Ionicons name="person" size={14} color="#3b82f6" />
                        </View>
                      )}

                      {(item.approved_users_count || 0) >= 2 && (
                        <View className="w-8 h-8 rounded-full bg-blue-300 border-2 border-white dark:border-gray-900 -ml-3 items-center justify-center">
                          <Ionicons name="person" size={14} color="#1d4ed8" />
                        </View>
                      )}

                      {(item.approved_users_count || 0) > 2 && (
                        <View className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 -ml-3 items-center justify-center">
                          <Text className="text-[10px] text-gray-600 dark:text-gray-400 font-bold">
                            +{(item.approved_users_count || 0) - 2}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                <TouchableOpacity
                  className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg"
                  onPress={() => onAccessClub(item.id)}
                >
                  <Text className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                    Access Club
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
