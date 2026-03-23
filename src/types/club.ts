export type ClubCategory =
  | "academics"
  | "culture_and_performing_arts"
  | "socio_politics";

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
}

export interface ClubPayload {
  name: string;
  category: ClubCategory | string;
  description?: string | undefined;
  adviser?: string;
  logo?: string;
}
