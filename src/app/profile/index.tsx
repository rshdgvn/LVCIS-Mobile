import { useAuth } from "@/src/contexts/AuthContext";
import { useThrottledRouter } from "@/src/hooks/useThrottledRouter";
import ProfileScreen from "@/src/screens/private/profile/ProfileScreen";
import React from "react";

const Profile = () => {
  const { signOut } = useAuth();
  const router = useThrottledRouter();

  const handleSignOut = async () => {
    await signOut();
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
