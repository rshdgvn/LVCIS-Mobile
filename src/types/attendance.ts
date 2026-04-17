import { Club } from "./club";
import { User } from "./user";

export type AttendanceStatus = "present" | "absent" | "late" | "excuse";

export interface AttendanceSession {
  id: number;
  club_id: number;
  event_id?: number | null;
  created_by?: number | null;
  title: string;
  venue: string | null;
  is_open: boolean;
  date: string;
  club?: Club;
  event?: Event;
  created_at?: string;
  updated_at?: string;
}

export interface Attendance {
  id: number;
  attendance_session_id: number;
  user_id: number;
  status: AttendanceStatus | null;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  excuse: number;
}

export interface SessionPayload {
  title?: string;
  venue?: string;
  date?: string;
  is_open?: boolean;
  club_id?: number;
  event_id?: number | null;
}
