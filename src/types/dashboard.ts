export interface ClubsOverviewData {
  total: number;
  trend_text: string;
}

export interface EngagementOverviewData {
  percentage: number;
  target: number;
  trend_text: string;
}

export interface AttendanceTrendData {
  label: string;
  value: number;
}

export interface AdditionalStatsData {
  overview: {
    total_real_students: number;
    active_events: number;
  };
  roles_pie_chart: {
    total: number;
    data: { value: number; text: string; color?: string }[];
  };
  activity_pie_chart: {
    total: number;
    data: { value: number; text: string; color?: string }[];
  };
}

export interface ManagerStats {
  total_members: number;
  pending_requests: number;
  engagement_rate: number;
  activity_pie_chart?: {
    total: number;
    data: { value: number; text: string; color?: string }[];
  };
}

export interface ManagerInsights {
  pipeline_title: string;
  events: {
    upcoming: number;
    ongoing: number;
    completed: number;
    total: number;
  };
  demographics: {
    label: string;
    value: number;
  }[];
}

export interface AttendanceTrendItem {
  label: string;
  value: number;
}

export interface MemberOverview {
  role: string;
  title: string;
  attendance_rate: number;
  joined_at: string;
}

export interface MemberTask {
  id: number;
  title: string;
  status: "pending" | "in_progress" | "completed";
  event: {
    id: number;
    title: string;
  };
}

export interface UpcomingEvent {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  date: string | null;
  venue: string;
  is_ongoing: boolean;
}