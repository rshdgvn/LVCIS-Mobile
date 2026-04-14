import { useAuth } from "@/src/contexts/AuthContext";

export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === "admin";
};
