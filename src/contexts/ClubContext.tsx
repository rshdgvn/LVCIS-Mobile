import { api } from "@/src/api/api";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useContext, useMemo } from "react";
import { Club } from "../types/club";
import { useAuth } from "./AuthContext";

type ClubContextType = {
  clubs: Club[];
  isLoading: boolean;
  getUserRole: (clubId: number | string) => string | null;
  isOfficer: (clubId: number | string) => boolean;
  isMember: (clubId: number | string) => boolean;
};

const ClubContext = createContext<ClubContextType>({} as ClubContextType);

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  const { data: clubs = [], isLoading } = useQuery<Club[]>({
    queryKey: ["userClubs"],
    queryFn: async () => {
      const response = await api.get("/my/clubs");
      console.log("Fetched clubs:", response.data);
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const getUserRole = useCallback(
    (clubId: number | string) => {
      const club = clubs.find((c) => Number(c.id) === Number(clubId));
      return club?.pivot?.role || null;
    },
    [clubs],
  );

  const isOfficer = useCallback(
    (clubId: number | string) => {
      const role = getUserRole(clubId);
      return role === "officer" || role === "adviser";
    },
    [getUserRole],
  );

  const isMember = useCallback(
    (clubId: number | string) => {
      const role = getUserRole(clubId);
      return ["member", "officer", "adviser"].includes(role as string);
    },
    [getUserRole],
  );

  const value = useMemo(
    () => ({
      clubs,
      isLoading,
      getUserRole,
      isOfficer,
      isMember,
    }),
    [clubs, isLoading, getUserRole, isOfficer, isMember],
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export const useClub = () => useContext(ClubContext);
