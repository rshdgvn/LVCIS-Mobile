import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboardService";

export const useAdminDashboard = () => {
  const clubsQuery = useQuery({
    queryKey: ["admin", "clubsOverview"],
    queryFn: dashboardService.getClubsOverview,
  });

  const engagementQuery = useQuery({
    queryKey: ["admin", "engagementOverview"],
    queryFn: dashboardService.getEngagementOverview,
  });

  const trendQuery = useQuery({
    queryKey: ["admin", "attendanceTrend"],
    queryFn: dashboardService.getAttendanceTrend,
  });

  const statsQuery = useQuery({
    queryKey: ["admin", "additionalStats"],
    queryFn: dashboardService.getAdditionalStats,
  });

  const isLoading =
    clubsQuery.isLoading ||
    engagementQuery.isLoading ||
    trendQuery.isLoading ||
    statsQuery.isLoading;

  const isRefetching =
    clubsQuery.isRefetching ||
    engagementQuery.isRefetching ||
    trendQuery.isRefetching ||
    statsQuery.isRefetching;

  const refetchAll = () => {
    clubsQuery.refetch();
    engagementQuery.refetch();
    trendQuery.refetch();
    statsQuery.refetch();
  };

  return {
    clubs: clubsQuery.data,
    engagement: engagementQuery.data,
    trend: trendQuery.data,
    stats: statsQuery.data,
    isLoading,
    isRefetching,
    refetchAll,
  };
};
