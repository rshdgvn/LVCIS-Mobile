import { useAuth } from "@/src/contexts/AuthContext";
import ProfileScreen from "@/src/screens/private/profile/ProfileScreen";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

const Profile = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleEditProfile = () => {
    router.push("/profile/edit-profile");
  };

  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handleNotifications = () => {
    router.push("/profile/notifications");
  };

  return (
    <ProfileScreen
      onSignOut={handleSignOut}
      onEditProfile={handleEditProfile}
      onChangePassword={handleChangePassword}
      onNotifications={handleNotifications}
    />
  );
};

export default Profile;
