export interface Driver {
  id: number;
  name: string;
  phone_number: string;
  seats_available: number;
  pickup_area: string;
  leave_kfm_time?: string;
  leave_ucla_time?: string;
  notes?: string;
  created_at: string;
}

export interface Rider {
  id: number;
  name: string;
  phone_number: string;
  seats_needed: number;
  pickup_area: string;
  notes?: string;
  driver_id?: number;
  created_at: string;
}

export interface Match {
  driver: Driver;
  riders: Rider[];
  total_seats_used: number;
  remaining_seats: number;
}

export interface UnmatchedRider extends Rider {
  reason?: string;
}

export interface DashboardData {
  drivers: Driver[];
  riders: Rider[];
  matches: Match[];
  unmatched_riders: UnmatchedRider[];
  total_drivers: number;
  total_riders: number;
  total_matches: number;
  total_unmatched: number;
}

export interface FormData {
  name: string;
  phone_number: string;
  seats_available?: number;
  seats_needed?: number;
  pickup_area: string;
  leave_kfm_time?: string;
  leave_ucla_time?: string;
  notes?: string;
}

export const PICKUP_AREAS = [
  'Ackerman Turnaround',
  'De Neve & Gayley Intersection',
  'Gayley Heights'
] as const;
