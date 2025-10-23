import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Driver, Rider, Match, UnmatchedRider } from '@/types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
  // Format phone number for display
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatTimePreference(preference: string): string {
  const preferences = {
    'leave_early': 'Leave Early',
    'stay_after': 'Stay After',
    'flexible': 'Flexible'
  };
  return preferences[preference as keyof typeof preferences] || preference;
}

export function getTimePreferenceColor(preference: string): string {
  const colors = {
    'leave_early': 'text-blue-600 bg-blue-100',
    'stay_after': 'text-green-600 bg-green-100',
    'flexible': 'text-purple-600 bg-purple-100'
  };
  return colors[preference as keyof typeof colors] || 'text-gray-600 bg-gray-100';
}

export function getTimePreferenceScore(riderPreference: string, driverPreference: string): number {
  // Exact match gets highest score
  if (riderPreference === driverPreference) return 3;
  
  // Flexible matches get medium score
  if (riderPreference === 'flexible' || driverPreference === 'flexible') return 2;
  
  // Different preferences get lowest score (but still matchable)
  return 1;
}

export function createMatches(drivers: Driver[], riders: Rider[]): { matches: Match[], unmatchedRiders: UnmatchedRider[] } {
  const matches: Match[] = [];
  const unmatchedRiders: UnmatchedRider[] = [];
  const usedRiderIds = new Set<number>();

  // Sort drivers by pickup area and time preference for better matching
  const sortedDrivers = [...drivers].sort((a, b) => {
    if (a.pickup_area !== b.pickup_area) {
      return a.pickup_area.localeCompare(b.pickup_area);
    }
    return a.time_preference.localeCompare(b.time_preference);
  });

  for (const driver of sortedDrivers) {
    const driverMatches: Rider[] = [];
    let remainingSeats = driver.seats_available;

    // First, add already assigned riders to this driver
    const alreadyAssignedRiders = riders.filter(rider => rider.driver_id === driver.id);
    for (const rider of alreadyAssignedRiders) {
      driverMatches.push(rider);
      usedRiderIds.add(rider.id);
      remainingSeats -= rider.seats_needed;
    }

    // Note: We don't automatically assign unassigned riders here
    // They should remain in the unmatched section until manually assigned

    // Always add the driver to matches, even if no riders are matched
    matches.push({
      driver,
      riders: driverMatches,
      total_seats_used: driver.seats_available - remainingSeats,
      remaining_seats: Math.max(0, remainingSeats) // Ensure remaining seats is never negative
    });
  }

  // Find unmatched riders (only unassigned ones)
  for (const rider of riders) {
    if (!usedRiderIds.has(rider.id) && !rider.driver_id) {
      unmatchedRiders.push({
        ...rider,
        reason: 'No compatible driver found'
      });
    }
  }

  return { matches, unmatchedRiders };
}

export function getDashboardStats(drivers: Driver[], riders: Rider[], matches: Match[], unmatchedRiders: UnmatchedRider[]) {
  return {
    total_drivers: drivers.length,
    total_riders: riders.length,
    total_matches: matches.length,
    total_unmatched: unmatchedRiders.length,
    total_seats_available: drivers.reduce((sum, driver) => sum + driver.seats_available, 0),
    total_seats_needed: riders.reduce((sum, rider) => sum + rider.seats_needed, 0),
    total_seats_matched: matches.reduce((sum, match) => sum + match.total_seats_used, 0)
  };
}

// Maps integration utilities
export function getMapsUrl(address: string, type: 'directions' | 'search' = 'directions'): string {
  const encodedAddress = encodeURIComponent(address);
  if (type === 'directions') {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
}

export function getDestinationMapsUrl(): string {
  return getMapsUrl('10980 Washington Blvd, Culver City, CA 90232');
}

export function getPickupAreaMapsUrl(pickupArea: string): string {
  // Map pickup areas to specific addresses or general UCLA locations
  const areaMappings: { [key: string]: string } = {
    'Ackerman Turnaround': 'Ackerman Union, Los Angeles, CA',
    'Hilgard & Westholme': 'Hilgard Ave & Westholme Ave, Los Angeles, CA',
    'Bruin Plaza': 'Bruin Plaza, Los Angeles, CA',
    'Strathmore & Gayley': 'Strathmore Dr & Gayley Ave, Los Angeles, CA',
    'Levering & Strathmore': 'Levering Ave & Strathmore Dr, Los Angeles, CA',
    'Weyburn & Kinross': 'Weyburn Dr & Kinross Ave, Los Angeles, CA',
    'Westwood Village (Broxton Garage)': 'Broxton Ave, Westwood Village, Los Angeles, CA',
    'De Neve Turnaround': 'De Neve Dr, Los Angeles, CA',
    'Rieber Turnaround': 'Rieber Ct, Los Angeles, CA',
    'Hedrick Turnaround': 'Hedrick Dr, Los Angeles, CA',
    'Saxon Turnaround': 'Saxon Dr, Los Angeles, CA',
    'Engineering IV Turnaround': 'Engineering IV, Los Angeles, CA',
    'Parking Lot 36 (Sunset Village)': 'Sunset Village, Los Angeles, CA',
    'Sunset & Hilgard': 'Sunset Blvd & Hilgard Ave, Los Angeles, CA',
  };
  
  const address = areaMappings[pickupArea] || `${pickupArea}, UCLA, Los Angeles, CA`;
  return getMapsUrl(address);
}
