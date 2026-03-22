import { Club } from "@/src/types/club";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton } from "@/src/components/common/BackButton";
import { ClubDetailsTab } from "@/src/components/clubs/ClubDetailsTab";
import { ClubMembersTab } from "@/src/components/clubs/ClubMembersTab";
import { ClubApplicationsTab } from "@/src/components/clubs/ClubApplicationsTab";

interface Props {
  club: Club | undefined;
  isLoading: boolean;
  onBack: () => void;
  onEdit: () => void;
}

type TabType = "details" | "members" | "applications";

export default function ClubDetailsScreen({ club, isLoading, onBack, onEdit }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("details");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-dark-bg">
        <ActivityIndicator size="large" color="#3b82f6" />
      </SafeAreaView>
    );
  }

  if (!club) return null;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-dark-bg">
      <View className="flex-row justify-between items-center px-5 pt-2 pb-4">
        <BackButton onPress={onBack} />
        <Text className="text-lg font-semibold text-gray-500 dark:text-gray-400">
          Club Profile
        </Text>
        <TouchableOpacity className="w-12 h-12 items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center mt-4 px-5">
          <Image
            source={{ uri: club.logo_url || "https://via.placeholder.com/150" }}
            className="w-24 h-24 rounded-full border border-gray-200 bg-gray-50"
            resizeMode="contain"
          />
          <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4 text-center">
            {club.name}
          </Text>

          <View className="flex-row items-center mt-2">
            <View className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full mr-2">
              <Text className="text-blue-500 dark:text-blue-400 text-[10px] font-bold uppercase">
                {club.category.replace(/_/g, " ")}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">
              •  {club.approved_users_count || 0} active members
            </Text>
          </View>

          <TouchableOpacity
            className="bg-blue-500 w-full py-3.5 rounded-xl items-center flex-row justify-center mt-6 shadow-sm"
            onPress={onEdit}
          >
            <Ionicons name="create-outline" size={18} color="white" className="mr-2" />
            <Text className="text-white font-semibold ml-2">Edit Club Profile</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-8 px-5 border-b border-gray-200 dark:border-gray-800">
          <TouchableOpacity
            className={`pb-3 mr-6 ${activeTab === "details" ? "border-b-2 border-blue-500" : ""}`}
            onPress={() => setActiveTab("details")}
          >
            <Text className={`font-semibold ${activeTab === "details" ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`pb-3 mr-6 ${activeTab === "members" ? "border-b-2 border-blue-500" : ""}`}
            onPress={() => setActiveTab("members")}
          >
            <Text className={`font-semibold ${activeTab === "members" ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
              Members
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`pb-3 flex-row items-center ${activeTab === "applications" ? "border-b-2 border-blue-500" : ""}`}
            onPress={() => setActiveTab("applications")}
          >
            <Text className={`font-semibold ${activeTab === "applications" ? "text-gray-900 dark:text-white" : "text-gray-400"}`}>
              Applications
            </Text>
            
            {(club.pending_applications_count || 0) > 0 && (
              <View className="w-2 h-2 rounded-full bg-red-500 ml-1 mb-3" />
            )}
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-4 mb-10">
          {activeTab === "details" && <ClubDetailsTab description={club.description} />}
          {activeTab === "members" && <ClubMembersTab />}
          {activeTab === "applications" && <ClubApplicationsTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}