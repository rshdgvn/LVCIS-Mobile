import { DashboardScreen } from "@/src/screens/private/DashboardScreen";
import { useRouter } from "expo-router";

const Dashboard = () => {
  const router = useRouter();

  return (
    <DashboardScreen
      onProfile={() => {
        router.push("/profile");
      }}
    />
  );
};

export default Dashboard;
