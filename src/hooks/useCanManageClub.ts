import { useRole } from "./useRole";

export function useCanManageClub() {
  const { isAdmin, isOfficer } = useRole();

  const canManageClub = (clubId: number | string): boolean => {
    if (isAdmin) {
      return true;
    }

    if (clubId && isOfficer) {
      return isOfficer(clubId);
    }

    return false;
  };

  return { canManageClub };
}
