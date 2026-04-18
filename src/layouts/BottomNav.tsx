import { useClub } from "@/src/contexts/ClubContext";
import { Tab } from "@/src/types/tab";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomNavProps {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { clubs, activeClubId, setActiveClubId } = useClub();
  const insets = useSafeAreaInsets();
  const activeClub = clubs.find((c) => c.id === activeClubId);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const leftTabs: { name: Tab; icon: any; activeIcon: any }[] = [
    { name: "Home", icon: "home-outline", activeIcon: "home" },
    {
      name: "Attendance",
      icon: "clipboard-check-outline",
      activeIcon: "clipboard-check",
    },
  ];

  const rightTabs: { name: Tab; icon: any; activeIcon: any }[] = [
    {
      name: "Clubs",
      icon: "account-group-outline",
      activeIcon: "account-group",
    },
    {
      name: "Events",
      icon: "calendar-blank-outline",
      activeIcon: "calendar-blank",
    },
  ];

  const containerPadding = Platform.OS === "ios" ? "pb-8 pt-3" : "py-3";

  const renderTab = (tab: { name: Tab; icon: any; activeIcon: any }) => {
    const isActive = activeTab === tab.name;
    const iconColor = isActive ? "#2563EB" : "#9CA3AF";
    const textClass = isActive
      ? "text-[#2563EB] dark:text-blue-400 font-bold"
      : "text-[#9CA3AF] dark:text-dark-muted-fg font-medium";

    return (
      <TouchableOpacity
        key={tab.name}
        className="flex-1 items-center justify-center"
        onPress={() => onTabPress(tab.name)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isActive ? tab.activeIcon : tab.icon}
          size={26}
          color={iconColor}
        />
        <Text className={`text-xs mt-1 ${textClass}`}>{tab.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        className={`flex-row bg-background dark:bg-dark-bg border-t border-border dark:border-dark-border items-center px-4 ${containerPadding}`}
      >
        {leftTabs.map(renderTab)}

        {/* Middle raised Switch Club button */}
        <View className="flex-1 items-center" style={{ marginTop: -28 }}>
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            activeOpacity={0.85}
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {/* White ring border around the button */}
            <View
              className="rounded-full bg-background dark:bg-dark-bg items-center justify-center"
              style={{ padding: 3 }}
            >
              <View
                className="rounded-full bg-primary dark:bg-dark-primary items-center justify-center overflow-hidden"
                style={{ width: 56, height: 56 }}
              >
                {activeClub?.logo_url ? (
                  <Image
                    source={{ uri: activeClub.logo_url }}
                    style={{ width: 56, height: 56, borderRadius: 28 }}
                  />
                ) : (
                  <Ionicons name="people" size={26} color="#ffffff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-[10px] text-muted-fg dark:text-dark-muted-fg font-medium mt-1">
            Switch Club
          </Text>
        </View>

        {rightTabs.map(renderTab)}
      </View>

      {/* Club picker bottom sheet */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable>
            <View
              className="bg-background dark:bg-dark-bg rounded-t-3xl pt-3 px-6"
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              <View className="w-12 h-1.5 bg-border dark:bg-dark-border rounded-full self-center mb-6" />

              <Text className="text-xl font-bold text-foreground dark:text-dark-fg mb-1">
                Switch Club
              </Text>
              <Text className="text-sm text-muted-fg dark:text-dark-muted-fg mb-5">
                Select your active club
              </Text>

              <FlatList
                data={clubs}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View className="py-8 items-center">
                    <Ionicons name="people-outline" size={40} color="#9ca3af" />
                    <Text className="text-muted-fg dark:text-dark-muted-fg text-base mt-3 text-center">
                      You are not part of any clubs yet.
                    </Text>
                  </View>
                }
                renderItem={({ item }) => {
                  const isSelected = item.id === activeClubId;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setActiveClubId(item.id);
                        setIsModalVisible(false);
                      }}
                      className={`flex-row items-center p-4 mb-2 rounded-2xl border ${
                        isSelected
                          ? "bg-primary/10 dark:bg-dark-primary/10 border-primary/20 dark:border-dark-primary/20"
                          : "bg-card dark:bg-dark-card border-border dark:border-dark-border"
                      }`}
                    >
                      <View className="w-12 h-12 rounded-full bg-primary/10 dark:bg-dark-primary/10 items-center justify-center mr-3 overflow-hidden">
                        {item.logo_url ? (
                          <Image
                            source={{ uri: item.logo_url }}
                            style={{ width: 48, height: 48, borderRadius: 24 }}
                          />
                        ) : (
                          <Ionicons name="people" size={22} color="#3b82f6" />
                        )}
                      </View>

                      <Text
                        className={`flex-1 text-base ${
                          isSelected
                            ? "font-bold text-foreground dark:text-dark-fg"
                            : "font-medium text-foreground dark:text-dark-fg"
                        }`}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>

                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#2563EB"
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
