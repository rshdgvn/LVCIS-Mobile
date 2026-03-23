import { DashboardScreen } from "@/src/screens/private/DashboardScreen";
import { useRouter } from "expo-router";
import { useRef } from "react";

const DashboardRoute = () => {
  const router = useRouter();
  const isNavigating = useRef(false);

  const handleProfilePress = () => {
    if (isNavigating.current) return;

    isNavigating.current = true;

    router.push("/profile");

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  return <DashboardScreen onProfile={handleProfilePress} />;
};

export default DashboardRoute;
