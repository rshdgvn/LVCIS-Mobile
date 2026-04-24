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
  total_students: number;
  active_events: number;
}
