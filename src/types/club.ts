export type ClubCategory =
  | "academics"
  | "culture_and_performing_arts"
  | "socio_politics";


export interface ClubMember {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  course: string | null;
  year_level: string | null;
  student_id: string | null;
  role: "member" | "officer";
  officer_title: string | null;
  joined_at: string;
}

export type ClubViewFilter = "all" | "my" | "pending" | "other";

export interface Club {
  id: number;
  name: string;
  category: ClubCategory | string;
  description: string | undefined;
  adviser: string | null;
  logo: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
  approved_users_count?: number;
  pending_applications_count?: number;
  users?: ClubMember[]; 
}

export interface ClubPayload {
  name: string;
  category: ClubCategory | string;
  description?: string | undefined;
  adviser?: string;
  logo?: string;
}

export interface MemberProfile {
  id: number;
  user_id: number;
  course: string | null;
  year_level: string | null;
  created_at: string;
  updated_at: string;
}

export interface PendingApplicant {
  user_id: number;
  avatar: string;
  first_name: string;
  last_name: string;
  email: string;
  course?: string;
  year_level?: string;
  requested_at: string;
}

export interface ClubMembership {
  id: number;
  club_id: number;
  user_id: number;
  role: "member" | "officer" | "adviser";
  officer_title: string | null;
  status: "pending" | "approved" | "rejected";
  activity_status: "active" | "inactive";
  joined_at: string;
}
