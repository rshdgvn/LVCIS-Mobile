import { BackButton } from "@/src/components/common/BackButton";
import { CustomAlertDialog } from "@/src/components/common/CustomAlertDialog";
import { ProfileOption } from "@/src/components/profile/ProfileOption";
import { ToggleTheme } from "@/src/components/profile/ToggleTheme";
import { useAuth } from "@/src/contexts/AuthContext";
import { router } from "expo-router";
import { Bell, LogOut, ShieldCheck, User } from "lucide-react-native";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  onSignOut: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
  onNotifications: () => void;
}

const ProfileScreen = ({
  onSignOut,
  onEditProfile,
  onChangePassword,
  onNotifications,
}: Props) => {
  const { user } = useAuth();
  const [isSignOutVisible, setSignOutVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <View className="flex-row items-center justify-between mt-2 px-6">
        <BackButton onPress={() => router.back()} />
        <Text className="text-lg font-bold self-center text-foreground/50 dark:text-dark-fg/50 my-4">
          Profile
        </Text>
        <View style={{ width: 48 }} />
      </View>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
      >
        <View className="items-center mt-4 mb-8">
          <View className="relative">
            <Image
              source={{ uri: user?.avatar }}
              className="w-32 h-32 rounded-full"
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
          onPress={onEditProfile}
        />
        <ProfileOption
          icon={ShieldCheck}
          title="Security"
          subtitle="Password"
          onPress={onChangePassword}
        />

        <Text className="text-muted-fg dark:text-dark-muted-fg font-bold text-xs uppercase tracking-widest mt-4 mb-4 ml-1">
          Preferences
        </Text>
        <ToggleTheme />
        <ProfileOption
          icon={Bell}
          title="Notifications"
          onPress={onNotifications}
        />

        <TouchableOpacity
          onPress={() => setSignOutVisible(true)}
          activeOpacity={0.8}
          className="flex-row items-center justify-center bg-red-200 dark:bg-red-900/30 p-4 rounded-2xl mt-8"
        >
          <LogOut size={20} color="#EF4444" className="mr-2" />
          <Text className="text-red-500 dark:text-red-400 font-bold text-base ml-2">
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomAlertDialog
        visible={isSignOutVisible}
        title="Sign Out"
        message="Are you sure you want to sign out of your account? You will need to log back in to access your clubs."
        cancelText="Cancel"
        confirmText="Sign Out"
        isDestructive={true}
        onCancel={() => setSignOutVisible(false)}
        onConfirm={() => {
          setSignOutVisible(false);
          onSignOut();
        }}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
