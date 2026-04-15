export interface EventDetail {
  id: number;
  event_id: number;
  event_date: string; // YYYY-MM-DD
  event_time: string; // HH:mm:ss
  venue: string;
  organizer: string;
  contact_person: string;
  contact_email: string;
  event_mode: 'online' | 'face_to_face' | 'hybrid';
  duration: string;
}

export interface Event {
  id: number;
  club_id: number;
  title: string;
  purpose: string;
  description: string;
  cover_image: string | null;
  photos: string[] | null;
  videos: string[] | null;
  status: 'upcoming' | 'ongoing' | 'completed';
  detail?: EventDetail; // Loaded via 'with:detail' in your controller
  club?: {
    id: number;
    name: string;
  };
}