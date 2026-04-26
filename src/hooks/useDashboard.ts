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

  return {
    clubs: clubsQuery.data,
    engagement: engagementQuery.data,
    trend: trendQuery.data,
    stats: statsQuery.data,
    isLoading:
      clubsQuery.isLoading ||
      engagementQuery.isLoading ||
      trendQuery.isLoading ||
      statsQuery.isLoading,
    refetch: () => {
      clubsQuery.refetch();
      engagementQuery.refetch();
      trendQuery.refetch();
      statsQuery.refetch();
    },
  };
};

export const useManagerDashboard = (clubId: number | null) => {
  const isEnabled = !!clubId && clubId !== 0;

  const stats = useQuery({
    queryKey: ["manager", "stats", clubId],
    queryFn: () => dashboardService.getManagerStats(clubId!),
    enabled: isEnabled,
  });

  const insights = useQuery({
    queryKey: ["manager", "insights", clubId],
    queryFn: () => dashboardService.getManagerInsights(clubId!),
    enabled: isEnabled,
  });

  const trend = useQuery({
    queryKey: ["manager", "trend", clubId],
    queryFn: () => dashboardService.getManagerTrend(clubId!),
    enabled: isEnabled,
  });

  return {
    stats: stats.data,
    insights: insights.data,
    trend: trend.data,
    isLoading: stats.isLoading || insights.isLoading || trend.isLoading,
    refetch: () => {
      stats.refetch();
      insights.refetch();
      trend.refetch();
    },
  };
};

export const useMemberDashboard = (clubId: number | null) => {
  const isEnabled = !!clubId && clubId !== 0;

  const overview = useQuery({
    queryKey: ["member", "overview", clubId],
    queryFn: () => dashboardService.getMemberOverview(clubId!),
    enabled: isEnabled,
  });

  const tasks = useQuery({
    queryKey: ["member", "tasks", clubId],
    queryFn: () => dashboardService.getMemberTasks(clubId!),
    enabled: isEnabled,
  });

  const events = useQuery({
    queryKey: ["member", "events", clubId],
    queryFn: () => dashboardService.getMemberEvents(clubId!),
    enabled: isEnabled,
  });

  return {
    overview: overview.data,
    tasks: tasks.data || [],
    events: events.data || [],
    isLoading: overview.isLoading || tasks.isLoading || events.isLoading,
    refetch: () => {
      overview.refetch();
      tasks.refetch();
      events.refetch();
    },
  };
};
