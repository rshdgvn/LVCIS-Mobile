import { useAuth } from "@/src/contexts/AuthContext";
import { useClub } from "@/src/contexts/ClubContext";

export function useRole() {
  const { user } = useAuth();

  const clubContext = useClub();

  const isAdmin = user?.role === "admin";

  const isOfficer = (clubId: number | string): boolean => {
    if (!clubContext || typeof clubContext.getUserRole !== "function") {
      return false;
    }

    const role = clubContext.getUserRole(clubId);
    return role === "officer" || role === "adviser";
  };

  const isMember = (clubId: number | string): boolean => {
    if (!clubContext || typeof clubContext.getUserRole !== "function") {
      return false;
    }

    const role = clubContext.getUserRole(clubId);
    return ["member", "officer", "adviser"].includes(role as string);
  };

  return { isAdmin, isOfficer, isMember };
}
