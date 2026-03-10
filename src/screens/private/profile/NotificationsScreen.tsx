import { FilterType } from "@/src/types/notifications";
import { Search } from "lucide-react-native";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/src/components/common/BackButton";
import { router } from "expo-router";

const FILTERS: FilterType[] = ["All", "Read", "Unread"];

interface Props {
  onBack: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

const NotificationsScreen = ({
  onBack,
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: Props) => {
  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="px-6 flex-1">
       <View className="flex-row items-center justify-between mt-2 mb-4 ">
           <BackButton onPress={() => router.back()} />
           <Text className="text-lg font-bold self-center text-foreground/50 dark:text-dark-fg/50 my-4">
             Notifications
           </Text>
           <View style={{ width: 48 }} />
       </View> 

        <View className="flex-row items-center bg-card dark:bg-dark-card border border-border dark:border-dark-border rounded-xl px-4 *: mt-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notification"
            placeholderTextColor="#9CA3AF"
            className="flex-1 ml-3 text-base text-foreground dark:text-dark-fg"
          />
        </View>

        <View className="flex-row mt-4 space-x-2 gap-2">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.7}
                className={`px-5 py-2 rounded-lg border ${
                  isActive
                    ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                    : "bg-transparent border-border dark:border-dark-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-white"
                      : "text-muted-fg dark:text-dark-muted-fg"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View className="flex-1 justify-center items-center pb-20">
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/7486/7486744.png",
            }}
            className="w-64 h-64 mb-4"
            resizeMode="contain"
          />
          <Text className="text-muted-fg dark:text-dark-muted-fg text-base">
            Looks like there's nothing here
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
