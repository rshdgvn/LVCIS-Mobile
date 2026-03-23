import { ClubApplicationsTab } from "@/src/components/clubs/ClubApplicationsTab";
import { ClubDetailsTab } from "@/src/components/clubs/ClubDetailsTab";
import { ClubMembersTab } from "@/src/components/clubs/ClubMembersTab";
import { BackButton } from "@/src/components/common/BackButton";
import { useTheme } from "@/src/hooks/useTheme"; // Adjust path if needed
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

interface Props {
  club: Club | undefined;
  isLoading: boolean;
  onBack: () => void;
  onEdit: (clubId: number) => void;
}

type TabType = "details" | "members" | "applications";

export default function ClubDetailsScreen({
  club,
  isLoading,
  onBack,
  onEdit,
}: Props) {
  const { primaryColor, mutedFgColor } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("details");

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background dark:bg-dark-bg">
        <ActivityIndicator size="large" color={primaryColor} />
      </SafeAreaView>
    );
  }

  if (!club) return null;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row justify-between items-center px-5 pt-2 pb-4">
        <BackButton onPress={onBack} />
        <Text className="text-lg font-semibold text-muted-fg dark:text-dark-muted-fg">
          Club Profile
        </Text>
        <TouchableOpacity className="w-12 h-12 items-center justify-center">
          <Ionicons name="ellipsis-horizontal" size={24} color={mutedFgColor} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center mt-4 px-5">
          <Image
            source={{ uri: club.logo_url || "https://via.placeholder.com/150" }}
            className="w-24 h-24 rounded-full border border-border dark:border-dark-border bg-muted dark:bg-dark-muted"
            resizeMode="contain"
          />
          <Text className="text-xl font-bold text-foreground dark:text-dark-fg mt-4 text-center">
            {club.name}
          </Text>

          <View className="flex-row items-center mt-2">
            <View className="bg-primary/10 dark:bg-dark-primary/20 px-3 py-1 rounded-full mr-2">
              <Text className="text-primary dark:text-dark-primary text-[10px] font-bold uppercase">
                {club.category.replace(/_/g, " ")}
              </Text>
            </View>
            <Text className="text-muted-fg dark:text-dark-muted-fg text-xs">
              • {club.approved_users_count || 0} active members
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary dark:bg-dark-primary w-full py-3.5 rounded-xl items-center flex-row justify-center mt-6 shadow-sm"
            onPress={() => onEdit(club.id)}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color="#ffffff"
              className="mr-2"
            />
            <Text className="text-primary-fg dark:text-dark-primary-fg font-semibold ml-2">
              Edit Club Profile
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row mt-8 px-5 border-b border-border dark:border-dark-border">
          <TouchableOpacity
            className={`pb-3 mr-6 ${activeTab === "details" ? "border-b-2 border-primary dark:border-dark-primary" : ""}`}
            onPress={() => setActiveTab("details")}
          >
            <Text
              className={`font-semibold ${activeTab === "details" ? "text-foreground dark:text-dark-fg" : "text-muted-fg dark:text-dark-muted-fg"}`}
            >
              Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`pb-3 mr-6 ${activeTab === "members" ? "border-b-2 border-primary dark:border-dark-primary" : ""}`}
            onPress={() => setActiveTab("members")}
          >
            <Text
              className={`font-semibold ${activeTab === "members" ? "text-foreground dark:text-dark-fg" : "text-muted-fg dark:text-dark-muted-fg"}`}
            >
              Members
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`pb-3 flex-row items-center ${activeTab === "applications" ? "border-b-2 border-primary dark:border-dark-primary" : ""}`}
            onPress={() => setActiveTab("applications")}
          >
            <Text
              className={`font-semibold ${activeTab === "applications" ? "text-foreground dark:text-dark-fg" : "text-muted-fg dark:text-dark-muted-fg"}`}
            >
              Applications
            </Text>

            {(club.pending_applications_count || 0) > 0 && (
              <View className="w-2 h-2 rounded-full bg-destructive dark:bg-dark-destructive ml-1 mb-3" />
            )}
          </TouchableOpacity>
        </View>

        <View className="px-5 mt-4 mb-10">
          {activeTab === "details" && (
            <ClubDetailsTab description={club.description} />
          )}
          {activeTab === "members" && <ClubMembersTab />}
          {activeTab === "applications" && <ClubApplicationsTab />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
