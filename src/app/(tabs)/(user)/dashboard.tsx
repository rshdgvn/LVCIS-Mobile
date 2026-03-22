import { DashboardScreen } from "@/src/screens/private/DashboardScreen";
import { useRouter } from "expo-router";

const DashboardRoute = () => {
  const router = useRouter();

  return (
    <DashboardScreen
      onProfile={() => {
        router.push("/profile");
      }}
    />
  );
};

export default DashboardRoute;
