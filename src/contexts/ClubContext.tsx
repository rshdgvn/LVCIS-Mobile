// src/contexts/ClubContext.tsx

import { api } from "@/src/api/api";
import { useQuery } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Club } from "../types/club";
import { useAuth } from "./AuthContext";

type ClubContextType = {
  clubs: Club[];
  isLoading: boolean;
  activeClubId: number | null;
  setActiveClubId: (id: number | null) => void;
  getUserRole: (clubId: number | string) => string | null;
  isOfficer: (clubId: number | string) => boolean;
  isMember: (clubId: number | string) => boolean;
};

const ClubContext = createContext<ClubContextType>({} as ClubContextType);

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [activeClubId, setActiveClubId] = useState<number | null>(null);

  const isInitialized = useRef(false);

  const { data: clubs = [], isLoading } = useQuery<Club[]>({
    queryKey: ["userClubs"],
    queryFn: async () => {
      const response = await api.get("/my/clubs");
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!isInitialized.current && user) {
      const isAdmin = user.role === "admin";

      if (isAdmin) {
        setActiveClubId(null);
        isInitialized.current = true;
      } else if (clubs.length > 0) {
        setActiveClubId(clubs[0].id);
        isInitialized.current = true;
      } else if (!isLoading) {
        isInitialized.current = true;
      }
    }
  }, [clubs, user, isLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      setActiveClubId(null);
      isInitialized.current = false;
    }
  }, [isAuthenticated]);

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
      return role === "officer" || role === "adviser" || role === "admin";
    },
    [getUserRole],
  );

  const isMember = useCallback(
    (clubId: number | string) => {
      const role = getUserRole(clubId);
      return ["member", "officer", "adviser", "admin"].includes(role as string);
    },
    [getUserRole],
  );

  const value = useMemo(
    () => ({
      clubs,
      isLoading,
      activeClubId,
      setActiveClubId,
      getUserRole,
      isOfficer,
      isMember,
    }),
    [clubs, isLoading, activeClubId, getUserRole, isOfficer, isMember],
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export const useClub = () => useContext(ClubContext);
