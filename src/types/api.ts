export interface Driver {
  id: number;
  name: string;
  phone_number: string;
  seats_available: number;
  pickup_area: string;
  time_preference: 'leave_early' | 'stay_after' | 'flexible';
  notes?: string;
  created_at: string;
}

export interface Rider {
  id: number;
  name: string;
  phone_number: string;
  seats_needed: number;
  pickup_area: string;
  time_preference: 'leave_early' | 'stay_after' | 'flexible';
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
  time_preference: 'leave_early' | 'stay_after' | 'flexible';
  notes?: string;
}

export const PICKUP_AREAS = [
  'Ackerman Turnaround',
  'Hilgard & Westholme',
  'Bruin Plaza',
  'Strathmore & Gayley',
  'Levering & Strathmore',
  'Weyburn & Kinross',
  'Westwood Village (Broxton Garage)',
  'De Neve Turnaround',
  'Rieber Turnaround',
  'Hedrick Turnaround',
  'Saxon Turnaround',
  'Engineering IV Turnaround',
  'Parking Lot 36 (Sunset Village)',
  'Sunset & Hilgard',
  'Other'
] as const;

export const TIME_PREFERENCES = [
  { value: 'leave_early', label: '⏰ Leave Early - Right after prayer' },
  { value: 'stay_after', label: '🕐 Stay After - Socialize/food' },
  { value: 'flexible', label: '🔄 Flexible - Either works' }
] as const;
