import { ClubManagerDashboard } from "@/src/components/dashboard/ClubManagerDashboard";
import { ClubMemberDashboard } from "@/src/components/dashboard/ClubMemberDashboard";
import { SystemOverviewDashboard } from "@/src/components/dashboard/SystemOverviewDashboard";
import { useAuth } from "@/src/contexts/AuthContext";
import { useClub } from "@/src/contexts/ClubContext";
import { useCanManageClub } from "@/src/hooks/useCanManageClub";
import { useIsAdmin } from "@/src/hooks/useIsAdmin";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

interface Props {
  onProfile: () => void;
}

export const DashboardScreen = ({ onProfile }: Props) => {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const { canManageClub } = useCanManageClub();
  const insets = useSafeAreaInsets();
  const { clubs, activeClubId, setActiveClubId, getUserRole } = useClub();
  const [clubModalVisible, setClubModalVisible] = useState(false);

  const activeClub = clubs.find((c) => c.id === activeClubId);
  const isGeneralView = activeClubId === null;

  let displayRole = "Member";
  if (isAdmin && isGeneralView) {
    displayRole = "System Admin";
  } else if (activeClubId) {
    const rawRole = getUserRole(activeClubId) || "member";
    displayRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
  }

  const getHeaderTitle = () => {
    if (isGeneralView) {
      return isAdmin ? "General Overview" : "No Clubs Found";
    }
    return activeClub?.name || "Select a Club";
  };

  const renderDashboardContent = () => {
    if (isGeneralView && isAdmin) {
      return <SystemOverviewDashboard />;
    }

    if (isGeneralView && !isAdmin) {
      return (
        <View className="flex-1 items-center justify-center px-6 py-16">
          <View className="w-20 h-20 bg-primary/10 dark:bg-dark-primary/10 rounded-full items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="home-outline"
              size={36}
              color="#2563EB"
            />
          </View>
          <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-2">
            No Club Selected
          </Text>
          <Text className="text-sm text-center text-muted-fg dark:text-dark-muted-fg">
            {clubs.length === 0
              ? "You are not part of any clubs yet."
              : "You need to join a club to access your dashboard."}
          </Text>
        </View>
      );
    }

    if (activeClubId && canManageClub(activeClubId)) {
      return <ClubManagerDashboard clubId={activeClubId} />;
    }

    if (activeClubId) {
      return <ClubMemberDashboard clubId={activeClubId} />;
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC] dark:bg-dark-bg">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row items-center px-6 pt-6 pb-6">
          <TouchableOpacity
            onPress={onProfile}
            activeOpacity={0.8}
            className="w-12 h-12 rounded-full bg-primary/10 mr-4 dark:bg-dark-primary/10 items-center justify-center border border-border dark:border-dark-border overflow-hidden shadow-sm"
          >
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#3b82f6"
              />
            )}
          </TouchableOpacity>
          <View>
            <Text className="text-sm font-semibold text-muted-fg dark:text-dark-muted-fg tracking-wider">
              Welcome back
            </Text>
            <Text className="text-2xl font-bold text-foreground dark:text-dark-fg">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setClubModalVisible(true)}
            className="bg-white dark:bg-dark-card rounded-3xl p-5 border border-border dark:border-dark-border flex-row items-center shadow-sm"
          >
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center mr-4 overflow-hidden">
              {isGeneralView ? (
                <MaterialCommunityIcons
                  name={isAdmin ? "grid" : "alert-circle"}
                  size={26}
                  color="#3b82f6"
                />
              ) : activeClub?.logo_url ? (
                <Image
                  source={{ uri: activeClub.logo_url }}
                  style={{ width: "100%", height: "100%" }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="account-group"
                  size={26}
                  color="#3b82f6"
                />
              )}
            </View>
            <View className="flex-1 justify-center">
              <View className="flex-row items-center mb-1">
                <Text className="text-xs font-bold text-primary dark:text-dark-primary tracking-wide">
                  {!isAdmin && isGeneralView ? "No Access" : displayRole}
                </Text>
              </View>
              <Text
                className="text-lg font-bold text-foreground dark:text-dark-fg"
                numberOfLines={1}
              >
                {getHeaderTitle()}
              </Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 items-center justify-center border border-slate-100 dark:border-slate-700">
              <MaterialCommunityIcons
                name="swap-vertical"
                size={20}
                color="#64748b"
              />
            </View>
          </TouchableOpacity>
        </View>

        {renderDashboardContent()}
      </ScrollView>

      <Modal
        visible={clubModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setClubModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Pressable
            className="flex-1"
            onPress={() => setClubModalVisible(false)}
          />
          <View
            className="bg-white dark:bg-dark-bg rounded-t-[32px] pt-4 shadow-xl"
            style={{
              maxHeight: "85%",
              paddingBottom: Math.max(insets.bottom, 24),
            }}
          >
            <View className="px-6">
              <View className="w-14 h-1.5 bg-slate-200 dark:bg-dark-border rounded-full self-center mb-6" />
              <View className="mb-6">
                <Text className="text-2xl font-bold text-slate-800 dark:text-dark-fg mb-1">
                  Switch Context
                </Text>
                <Text className="text-sm text-slate-500 dark:text-dark-muted-fg">
                  Select which club workspace to view
                </Text>
              </View>
            </View>

            <FlatList
              data={clubs}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              className="px-6"
              contentContainerStyle={{ paddingBottom: 16 }}
              ListHeaderComponent={
                isAdmin ? (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveClubId(null);
                      setClubModalVisible(false);
                    }}
                    className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isGeneralView ? "bg-blue-50 dark:bg-dark-primary/10 border-blue-200 dark:border-dark-primary/30" : "bg-slate-50 dark:bg-dark-card border-slate-100 dark:border-dark-border"}`}
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center mr-4 ${isGeneralView ? "bg-blue-100" : "bg-white border border-slate-200"}`}
                    >
                      <MaterialCommunityIcons
                        name="grid"
                        size={22}
                        color={isGeneralView ? "#2563EB" : "#64748b"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className={`text-base ${isGeneralView ? "font-bold text-blue-700" : "font-semibold text-slate-700"}`}
                      >
                        General Overview
                      </Text>
                      <Text className="text-xs text-slate-500 font-medium mt-0.5">
                        Admin Level View
                      </Text>
                    </View>
                    {isGeneralView && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={26}
                        color="#3b82f6"
                      />
                    )}
                  </TouchableOpacity>
                ) : null
              }
              renderItem={({ item }) => {
                const isSelected = item.id === activeClubId;
                const itemRole = getUserRole(item.id);
                const displayItemRole = itemRole
                  ? itemRole.charAt(0).toUpperCase() + itemRole.slice(1)
                  : "Member";

                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      setActiveClubId(item.id);
                      setClubModalVisible(false);
                    }}
                    className={`flex-row items-center p-4 mb-3 rounded-2xl border ${isSelected ? "bg-blue-50 dark:bg-dark-primary/10 border-blue-200 dark:border-dark-primary/30" : "bg-slate-50 dark:bg-dark-card border-slate-100 dark:border-dark-border"}`}
                  >
                    <View
                      className={`w-12 h-12 rounded-xl items-center justify-center mr-4 overflow-hidden ${!item.logo_url && "bg-white border border-slate-200"}`}
                    >
                      {item.logo_url ? (
                        <Image
                          source={{ uri: item.logo_url }}
                          style={{ width: "100%", height: "100%" }}
                        />
                      ) : (
                        <MaterialCommunityIcons
                          name="account-group"
                          size={22}
                          color="#64748b"
                        />
                      )}
                    </View>
                    <View className="flex-1 pr-2">
                      <Text
                        className={`text-base mb-0.5 ${isSelected ? "font-bold text-blue-700 dark:text-primary" : "font-semibold text-slate-700 dark:text-dark-fg"}`}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-xs text-slate-500 dark:text-dark-muted-fg font-medium">
                        {displayItemRole}
                      </Text>
                    </View>
                    {isSelected && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={26}
                        color="#3b82f6"
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
