import { DashboardScreen } from "@/src/screens/private/DashboardScreen";
import { useRouter } from "expo-router";

const AdminDashboardRoute = () => {
  const router = useRouter();

  return (
    <DashboardScreen
      onProfile={() => {
        router.push("/profile");
      }}
    />
  );
};

export default AdminDashboardRoute;
