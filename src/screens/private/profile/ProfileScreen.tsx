import { ToggleTheme } from "@/src/components/settings/ToggleTheme";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  Bell,
  ChevronRight,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onSignOut: () => void;
}

export const ProfileScreen = ({ onSignOut }: Props) => {
  const { user } = useAuth();

  const ProfileOption = ({
    icon: Icon,
    title,
    subtitle,
    showArrow = true,
  }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      className="flex-row items-center justify-between p-4 rounded-2xl bg-card dark:bg-dark-card mb-3"
    >
      <View className="flex-row items-center gap-4">
        <View className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20">
          <Icon size={22} color="#2563EB" />
        </View>
        <View>
          <Text className="text-foreground dark:text-dark-fg font-semibold text-base">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-muted-fg dark:text-dark-muted-fg text-xs">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && <ChevronRight size={20} color="#9CA3AF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <Text className="text-center text-lg font-bold text-foreground/50 dark:text-dark-fg/50 my-4">
          Profile
        </Text>

        <View className="items-center mt-4 mb-8">
          <View className="relative">
            <Image
              source={{ uri: user?.avatar }}
              className="w-32 h-32 rounded-full border-4 border-card dark:border-dark-card"
            />
          </View>
          <Text className="text-2xl font-bold text-foreground dark:text-dark-fg mt-4">
            {user?.first_name} {user?.last_name}
          </Text>
          <Text className="text-muted-fg dark:text-dark-muted-fg text-sm">
            {user?.email}
          </Text>
        </View>

        <Text className="text-muted-fg dark:text-dark-muted-fg font-bold text-xs uppercase tracking-widest mb-4 ml-1">
          Account Settings
        </Text>
        <ProfileOption
          icon={User}
          title="Edit Profile"
          subtitle="Name, Email, and course"
        />
        <ProfileOption
          icon={ShieldCheck}
          title="Security"
          subtitle="Password"
        />

        <Text className="text-muted-fg dark:text-dark-muted-fg font-bold text-xs uppercase tracking-widest mt-4 mb-4 ml-1">
          Preferences
        </Text>
        <ToggleTheme />
        <ProfileOption icon={Bell} title="Notifications" />

        <TouchableOpacity
          onPress={onSignOut}
          activeOpacity={0.8}
          className="flex-row items-center justify-center bg-red-200 dark:bg-red-900/30 p-4 rounded-2xl mt-8"
        >
          <LogOut size={20} color="#EF4444" className="mr-2" />
          <Text className="text-red-500 dark:text-red-400 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
