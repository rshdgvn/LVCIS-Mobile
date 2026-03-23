import { ClubCard } from "@/src/components/clubs/ClubCard";
import {
  getFilterLabel,
  showCategoryFilterAlert,
  showViewFilterAlert,
} from "@/src/helpers/clubFilters";
import { ClubViewFilter } from "@/src/hooks/useClubs";
import { Club, ClubCategory } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
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
          className="border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 flex-row items-center max-w-[200px]"
          onPress={() => showCategoryFilterAlert(onSelectCategory)}
        >
          <Text className="text-gray-500 dark:text-gray-400 mr-1">
            Category:
          </Text>
          <Text
            className="text-blue-500 font-semibold capitalize flex-shrink"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
          onPress={() => showViewFilterAlert(onSelectViewFilter)}
        >
          <Text className="text-white font-semibold mr-1">
            {getFilterLabel(viewFilter)}
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
            <ClubCard club={item} onAccessClub={onAccessClub} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
